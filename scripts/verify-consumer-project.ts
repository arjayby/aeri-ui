import { spawn } from "node:child_process";
import {
	cpSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const fixtureDirectory = join(repositoryRoot, "fixtures", "consumer-project");
const registryPayloadDirectory = join(
	repositoryRoot,
	"apps",
	"web",
	"public",
	"r",
);
const consumerProjectDirectory = mkdtempSync(
	join(tmpdir(), "aeri-ui-consumer-project-"),
);

function runPnpm(args: string[], cwd = consumerProjectDirectory) {
	return new Promise<void>((resolve, reject) => {
		const child = spawn("pnpm", args, { cwd, stdio: "inherit" });

		child.once("error", reject);
		child.once("exit", (code) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(new Error(`pnpm ${args.join(" ")} exited with code ${code}.`));
		});
	});
}

async function serveRegistry() {
	const server = createServer((request, response) => {
		const itemName = request.url?.match(
			/^\/r\/(accordion|button|switch|tabs|tooltip)\.json$/,
		)?.[1];

		if (itemName) {
			response.writeHead(200, { "content-type": "application/json" });
			response.end(
				readFileSync(join(registryPayloadDirectory, `${itemName}.json`)),
			);
			return;
		}

		response.writeHead(404);
		response.end();
	});

	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();

	if (!address || typeof address === "string") {
		throw new Error("The local Aeri UI registry did not expose a TCP port.");
	}

	return {
		close: () =>
			new Promise<void>((resolve, reject) =>
				server.close((error) => (error ? reject(error) : resolve())),
			),
		url: `http://127.0.0.1:${address.port}/r/{name}.json`,
	};
}

async function getAvailablePort() {
	const server = createServer();
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();

	if (!address || typeof address === "string") {
		throw new Error("The Consumer Project did not reserve a TCP port.");
	}

	await new Promise<void>((resolve, reject) =>
		server.close((error) => (error ? reject(error) : resolve())),
	);
	return address.port;
}

function startConsumerProject(port: number) {
	return spawn("pnpm", ["exec", "next", "start", "--port", String(port)], {
		cwd: consumerProjectDirectory,
		stdio: "inherit",
	});
}

async function waitForConsumerProject(url: string) {
	let lastError: unknown;

	for (let attempt = 0; attempt < 30; attempt += 1) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch (error) {
			lastError = error;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	throw new Error(`The Consumer Project did not start: ${String(lastError)}`);
}

async function stopConsumerProject(server?: ReturnType<typeof spawn>) {
	if (!server) {
		return;
	}

	if (server.exitCode !== null) {
		return;
	}

	server.kill("SIGTERM");
	await new Promise<void>((resolve) => server.once("exit", () => resolve()));
}

async function verifyInstalledAccordion(url: string) {
	const browser = await chromium.launch();

	try {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto(url);
		const trigger = page.getByRole("button", { name: "Shipping" });

		if ((await trigger.getAttribute("aria-expanded")) !== "true") {
			throw new Error(
				"The installed Accordion did not render its default value.",
			);
		}

		await trigger.focus();
		await page.keyboard.press("Space");
		if ((await trigger.getAttribute("aria-expanded")) !== "false") {
			throw new Error(
				"The installed Accordion did not close with the keyboard.",
			);
		}

		const accessibility = await new AxeBuilder({ page }).analyze();
		if (accessibility.violations.length > 0) {
			throw new Error(
				`The installed Accordion has accessibility violations: ${accessibility.violations
					.map((violation) => violation.id)
					.join(", ")}`,
			);
		}

		await page.evaluate(
			() =>
				new Promise<void>((resolve) =>
					requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
				),
		);
		await trigger.evaluate((element) => {
			element.addEventListener(
				"click",
				() => {
					const startedAt = performance.now();
					let largestFrame = 0;
					let previousFrame = startedAt;

					requestAnimationFrame((frameTime) => {
						element.setAttribute(
							"data-response-time",
							String(frameTime - startedAt),
						);

						const measureFrame = (currentFrame: number) => {
							largestFrame = Math.max(
								largestFrame,
								currentFrame - previousFrame,
							);
							previousFrame = currentFrame;

							if (currentFrame - startedAt < 450) {
								requestAnimationFrame(measureFrame);
								return;
							}

							element.setAttribute("data-largest-frame", String(largestFrame));
						};

						requestAnimationFrame(measureFrame);
					});
				},
				{ once: true },
			);
		});
		await trigger.dispatchEvent("click");
		await page.waitForTimeout(500);
		const responseTime = Number(
			await trigger.getAttribute("data-response-time"),
		);
		const largestFrame = Number(
			await trigger.getAttribute("data-largest-frame"),
		);
		if (
			!Number.isFinite(responseTime) ||
			!Number.isFinite(largestFrame) ||
			responseTime >= 100 ||
			largestFrame >= 50
		) {
			throw new Error(
				`The installed Accordion exceeded its interaction budget: ${responseTime}ms response, ${largestFrame}ms frame.`,
			);
		}

		await page.waitForTimeout(300);
		const activeAnimations = await page
			.locator('[data-slot="aeri-accordion"]')
			.evaluate(
				(accordion) => accordion.getAnimations({ subtree: true }).length,
			);
		if (activeAnimations > 0) {
			throw new Error("The installed Accordion did not settle its animations.");
		}

		await page.emulateMedia({ reducedMotion: "reduce" });
		await trigger.click();
		const panel = page.getByRole("region", { name: "Shipping" });
		if (
			(await panel.evaluate(
				(element) => getComputedStyle(element).transitionProperty,
			)) !== "none"
		) {
			throw new Error("The installed Accordion did not suppress motion.");
		}
	} finally {
		await browser.close();
	}
}

async function verifyInstalledSwitch(url: string) {
	const browser = await chromium.launch();

	try {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto(url);
		const switchControl = page.getByRole("switch", {
			name: "Receive release notes",
		});

		if ((await switchControl.getAttribute("aria-checked")) !== "true") {
			throw new Error("The installed Switch did not render its default value.");
		}

		await switchControl.focus();
		await page.keyboard.press("Space");
		if ((await switchControl.getAttribute("aria-checked")) !== "false") {
			throw new Error("The installed Switch did not toggle with the keyboard.");
		}

		const accessibility = await new AxeBuilder({ page }).analyze();
		if (accessibility.violations.length > 0) {
			throw new Error(
				`The installed Switch has accessibility violations: ${accessibility.violations
					.map((violation) => violation.id)
					.join(", ")}`,
			);
		}

		await switchControl.evaluate((element) => {
			element.addEventListener(
				"pointerdown",
				() => {
					const startedAt = performance.now();
					let largestFrame = 0;
					let previousFrame = startedAt;

					requestAnimationFrame((frameTime) => {
						element.setAttribute(
							"data-response-time",
							String(frameTime - startedAt),
						);

						const measureFrame = (currentFrame: number) => {
							largestFrame = Math.max(
								largestFrame,
								currentFrame - previousFrame,
							);
							previousFrame = currentFrame;

							if (currentFrame - startedAt < 450) {
								requestAnimationFrame(measureFrame);
								return;
							}

							element.setAttribute("data-largest-frame", String(largestFrame));
						};

						requestAnimationFrame(measureFrame);
					});
				},
				{ once: true },
			);
		});
		await switchControl.click();
		await page.waitForTimeout(500);
		const responseTime = Number(
			await switchControl.getAttribute("data-response-time"),
		);
		const largestFrame = Number(
			await switchControl.getAttribute("data-largest-frame"),
		);
		if (
			!Number.isFinite(responseTime) ||
			!Number.isFinite(largestFrame) ||
			responseTime >= 100 ||
			largestFrame >= 50
		) {
			throw new Error(
				`The installed Switch exceeded its interaction budget: ${responseTime}ms response, ${largestFrame}ms frame.`,
			);
		}

		await page.waitForTimeout(300);
		const activeAnimations = await page
			.locator('[data-slot="aeri-switch"]')
			.evaluate(
				(switchRoot) => switchRoot.getAnimations({ subtree: true }).length,
			);
		if (activeAnimations > 0) {
			throw new Error("The installed Switch did not settle its animations.");
		}

		await page.emulateMedia({ reducedMotion: "reduce" });
		await switchControl.click();
		const thumb = page.locator('[data-slot="aeri-switch-thumb"]');
		if (
			(await thumb.evaluate(
				(element) => getComputedStyle(element).transitionProperty,
			)) !== "none"
		) {
			throw new Error("The installed Switch did not suppress motion.");
		}
	} finally {
		await browser.close();
	}
}

async function verifyInstalledTooltip(url: string) {
	const browser = await chromium.launch();

	try {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto(url);
		const trigger = page.getByRole("button", { name: "More tooltip info" });
		const tooltip = page.getByRole("tooltip");

		await trigger.evaluate((element) => {
			element.addEventListener(
				"focus",
				() => {
					const startedAt = performance.now();
					let largestFrame = 0;
					let previousFrame = startedAt;

					requestAnimationFrame((frameTime) => {
						element.setAttribute(
							"data-response-time",
							String(frameTime - startedAt),
						);

						const measureFrame = (currentFrame: number) => {
							largestFrame = Math.max(
								largestFrame,
								currentFrame - previousFrame,
							);
							previousFrame = currentFrame;

							if (currentFrame - startedAt < 450) {
								requestAnimationFrame(measureFrame);
								return;
							}

							element.setAttribute("data-largest-frame", String(largestFrame));
						};

						requestAnimationFrame(measureFrame);
					});
				},
				{ once: true },
			);
		});
		await trigger.focus();
		await tooltip.waitFor({ state: "visible" });
		await page.waitForTimeout(500);
		const responseTime = Number(
			await trigger.getAttribute("data-response-time"),
		);
		const largestFrame = Number(
			await trigger.getAttribute("data-largest-frame"),
		);
		if (
			!Number.isFinite(responseTime) ||
			!Number.isFinite(largestFrame) ||
			responseTime >= 100 ||
			largestFrame >= 50
		) {
			throw new Error(
				`The installed Tooltip exceeded its interaction budget: ${responseTime}ms response, ${largestFrame}ms frame.`,
			);
		}
		const tooltipId = await tooltip.getAttribute("id");
		if (
			tooltipId !== "consumer-tooltip-description" ||
			(await trigger.getAttribute("aria-describedby")) !== tooltipId
		) {
			throw new Error(
				"The installed Tooltip did not connect its trigger and content for assistive technology.",
			);
		}

		await page.emulateMedia({ reducedMotion: "reduce" });
		if (
			(await tooltip.evaluate(
				(element) => getComputedStyle(element).transitionProperty,
			)) !== "none"
		) {
			throw new Error("The installed Tooltip did not suppress motion.");
		}

		await page.waitForTimeout(300);
		const activeAnimations = await tooltip.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		);
		if (activeAnimations > 0) {
			throw new Error("The installed Tooltip did not settle its animations.");
		}

		await page.keyboard.press("Escape");
		await page.waitForTimeout(200);
		if (
			(await tooltip.isVisible()) ||
			(await trigger.getAttribute("aria-describedby")) !== null
		) {
			throw new Error(
				"The installed Tooltip did not dismiss cleanly with Escape.",
			);
		}

		const accessibility = await new AxeBuilder({ page }).analyze();
		if (accessibility.violations.length > 0) {
			throw new Error(
				`The installed Tooltip has accessibility violations: ${accessibility.violations
					.map((violation) => violation.id)
					.join(", ")}`,
			);
		}
	} finally {
		await browser.close();
	}
}

let registry: Awaited<ReturnType<typeof serveRegistry>> | undefined;
let consumerServer: ReturnType<typeof startConsumerProject> | undefined;

try {
	await runPnpm(["run", "registry:build"], repositoryRoot);
	cpSync(fixtureDirectory, consumerProjectDirectory, { recursive: true });
	const ordinaryButtonPath = join(
		consumerProjectDirectory,
		"src",
		"components",
		"ui",
		"button.tsx",
	);
	const ordinaryButtonSource = readFileSync(ordinaryButtonPath, "utf8");
	registry = await serveRegistry();
	const componentsConfigPath = join(
		consumerProjectDirectory,
		"components.json",
	);
	const componentsConfig = JSON.parse(
		readFileSync(componentsConfigPath, "utf8"),
	) as {
		registries?: Record<string, string>;
	};

	writeFileSync(
		componentsConfigPath,
		`${JSON.stringify(
			{
				...componentsConfig,
				registries: {
					...componentsConfig.registries,
					"@aeri-ui": registry.url,
				},
			},
			null,
			2,
		)}\n`,
	);

	await runPnpm(["install", "--frozen-lockfile"]);
	await runPnpm(["exec", "shadcn", "--help"]);
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/button", "--yes"]);
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/accordion", "--yes"]);
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/switch", "--yes"]);
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/tabs", "--yes"]);
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/tooltip", "--yes"]);

	if (readFileSync(ordinaryButtonPath, "utf8") !== ordinaryButtonSource) {
		throw new Error(
			"Installing Button overwrote the Consumer Project's shadcn Button.",
		);
	}

	const installedSources = [
		["accordion", "export {"],
		["button", "export { Button"],
		["switch", "export { Switch, SwitchThumb"],
		["tabs", "export {\n\tTabs,"],
		["tooltip", "export {\n\tTooltip,"],
	] as const;

	for (const [itemName, expectedExport] of installedSources) {
		const installedSourcePath = join(
			consumerProjectDirectory,
			"src",
			"components",
			"aeri",
			`${itemName}.tsx`,
		);

		if (!readFileSync(installedSourcePath, "utf8").includes(expectedExport)) {
			throw new Error(
				`Installing ${itemName} did not write the Aeri owned source.`,
			);
		}
	}
	await runPnpm(["run", "check-types"]);
	await runPnpm(["run", "build"]);
	const consumerPort = await getAvailablePort();
	consumerServer = startConsumerProject(consumerPort);
	const consumerUrl = `http://127.0.0.1:${consumerPort}`;
	await waitForConsumerProject(consumerUrl);
	await verifyInstalledAccordion(consumerUrl);
	await verifyInstalledSwitch(consumerUrl);
	await verifyInstalledTooltip(consumerUrl);
	console.log("Consumer Project fixture passed.");
} finally {
	await stopConsumerProject(consumerServer);
	await registry?.close();
	rmSync(consumerProjectDirectory, { force: true, recursive: true });
}

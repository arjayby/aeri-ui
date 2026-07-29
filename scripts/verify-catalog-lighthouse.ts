import { createServer } from "node:net";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium } from "@playwright/test";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const webDirectory = join(repositoryRoot, "apps", "web");
const routes = ["/"];
const performanceThreshold = 0.95;
const accessibilityThreshold = 1;
const lcpThreshold = 2_500;
const clsThreshold = 0.1;

type LighthouseReport = {
	audits: Record<string, { numericValue?: number }>;
	categories: Record<string, { score: number | null }>;
};

function getAvailablePort() {
	return new Promise<number>((resolvePort, reject) => {
		const server = createServer();
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			if (!address || typeof address === "string") {
				reject(new Error("Could not reserve a local port."));
				return;
			}
			server.close((error) =>
				error ? reject(error) : resolvePort(address.port),
			);
		});
	});
}

async function waitFor(url: string, process: ChildProcess) {
	const deadline = Date.now() + 30_000;
	while (Date.now() < deadline) {
		if (process.exitCode !== null) {
			throw new Error(`Process exited before ${url} became available.`);
		}
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch {
			// The server is still starting.
		}
		await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
	}
	throw new Error(`Timed out waiting for ${url}.`);
}

function stop(process: ChildProcess) {
	if (process.exitCode === null) {
		process.kill("SIGTERM");
	}
}

function assertScore(
	route: string,
	category: string,
	score: number | null,
	minimum: number,
) {
	if (score === null || score < minimum) {
		throw new Error(
			`${route} has a Lighthouse ${category} score of ${score ?? "unavailable"}; expected at least ${minimum}.`,
		);
	}
}

function assertAudit(
	route: string,
	report: LighthouseReport,
	audit: string,
	maximum: number,
) {
	const value = report.audits[audit]?.numericValue;
	if (value === undefined || value > maximum) {
		throw new Error(
			`${route} has ${audit} of ${value ?? "unavailable"}; expected at most ${maximum}.`,
		);
	}
}

const catalogPort = await getAvailablePort();
const catalogUrl = `http://127.0.0.1:${catalogPort}`;
const catalog = spawn("node", [".next/standalone/apps/web/server.js"], {
	cwd: webDirectory,
	env: { ...process.env, HOSTNAME: "127.0.0.1", PORT: String(catalogPort) },
	stdio: "ignore",
});

try {
	await waitFor(catalogUrl, catalog);
	const { default: lighthouse } = await import("lighthouse");
	for (const route of routes) {
		const chromePort = await getAvailablePort();
		const chromeProfile = mkdtempSync(join(tmpdir(), "aeri-ui-lighthouse-"));
		const chrome = spawn(
			chromium.executablePath(),
			[
				"--headless=new",
				"--disable-gpu",
				"--no-first-run",
				"--no-default-browser-check",
				`--remote-debugging-port=${chromePort}`,
				`--user-data-dir=${chromeProfile}`,
			],
			{ stdio: "ignore" },
		);

		try {
			await waitFor(`http://127.0.0.1:${chromePort}/json/version`, chrome);
			console.log(`Starting Lighthouse: ${route}`);
			const result = await lighthouse(`${catalogUrl}${route}`, {
				port: chromePort,
				output: "json",
				onlyCategories: ["performance", "accessibility"],
				formFactor: "desktop",
				maxWaitForFcp: 10_000,
				maxWaitForLoad: 10_000,
				throttlingMethod: "provided",
				screenEmulation: {
					mobile: false,
					width: 1_350,
					height: 940,
					deviceScaleFactor: 1,
					disabled: false,
				},
			});
			if (!result) {
				throw new Error(`Lighthouse returned no report for ${route}.`);
			}

			const report = result.lhr as LighthouseReport;
			console.log(
				`Lighthouse ${route}: performance ${report.categories.performance?.score}, accessibility ${report.categories.accessibility?.score}, FCP ${report.audits["first-contentful-paint"]?.numericValue}, LCP ${report.audits["largest-contentful-paint"]?.numericValue}, TBT ${report.audits["total-blocking-time"]?.numericValue}, CLS ${report.audits["cumulative-layout-shift"]?.numericValue}.`,
			);
			assertScore(
				route,
				"performance",
				report.categories.performance?.score ?? null,
				performanceThreshold,
			);
			assertScore(
				route,
				"accessibility",
				report.categories.accessibility?.score ?? null,
				accessibilityThreshold,
			);
			assertAudit(route, report, "largest-contentful-paint", lcpThreshold);
			assertAudit(route, report, "cumulative-layout-shift", clsThreshold);
			console.log(`Lighthouse passed: ${route}`);
		} finally {
			stop(chrome);
			rmSync(chromeProfile, { force: true, recursive: true });
		}
	}
} finally {
	stop(catalog);
}

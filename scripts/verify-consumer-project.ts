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
		const itemName = request.url?.match(/^\/r\/(button|tabs)\.json$/)?.[1];

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

let registry: Awaited<ReturnType<typeof serveRegistry>> | undefined;

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
	await runPnpm(["exec", "shadcn", "add", "@aeri-ui/tabs", "--yes"]);

	if (readFileSync(ordinaryButtonPath, "utf8") !== ordinaryButtonSource) {
		throw new Error(
			"Installing Button overwrote the Consumer Project's shadcn Button.",
		);
	}

	const installedButtonPath = join(
		consumerProjectDirectory,
		"src",
		"components",
		"aeri",
		"button.tsx",
	);

	if (!readFileSync(installedButtonPath, "utf8").includes("export { Button")) {
		throw new Error(
			"Installing Button did not write the Aeri owned Button source.",
		);
	}

	const installedTabsPath = join(
		consumerProjectDirectory,
		"src",
		"components",
		"aeri",
		"tabs.tsx",
	);

	if (!readFileSync(installedTabsPath, "utf8").includes("export {\n\tTabs,")) {
		throw new Error(
			"Installing Tabs did not write the Aeri owned Tabs source.",
		);
	}

	await runPnpm(["run", "check-types"]);
	await runPnpm(["run", "build"]);
	console.log("Consumer Project fixture passed.");
} finally {
	await registry?.close();
	rmSync(consumerProjectDirectory, { force: true, recursive: true });
}

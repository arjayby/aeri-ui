import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const fixtureDirectory = join(repositoryRoot, "fixtures", "consumer-project");
const consumerProjectDirectory = mkdtempSync(
	join(tmpdir(), "aeri-ui-consumer-project-"),
);

function runPnpm(args: string[]) {
	execFileSync("pnpm", args, {
		cwd: consumerProjectDirectory,
		stdio: "inherit",
	});
}

try {
	cpSync(fixtureDirectory, consumerProjectDirectory, { recursive: true });
	runPnpm(["install", "--frozen-lockfile"]);
	runPnpm(["exec", "shadcn", "--help"]);
	runPnpm(["run", "check-types"]);
	runPnpm(["run", "build"]);
	console.log("Consumer Project fixture passed.");
} finally {
	rmSync(consumerProjectDirectory, { force: true, recursive: true });
}

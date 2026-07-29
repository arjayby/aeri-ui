import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Budget = {
	emittedCssBytes: number;
	emittedJavaScriptBytes: number;
	sharedInitialJavaScriptBytes: number;
};

type BuildManifest = {
	rootMainFiles: string[];
};

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const webDirectory = join(repositoryRoot, "apps", "web");
const nextDirectory = join(webDirectory, ".next");
const staticChunkDirectory = join(nextDirectory, "static", "chunks");
const budget = JSON.parse(
	readFileSync(
		join(repositoryRoot, "docs", "catalog-performance-budget.json"),
		"utf8",
	),
) as Budget;
const manifest = JSON.parse(
	readFileSync(join(nextDirectory, "build-manifest.json"), "utf8"),
) as BuildManifest;

if (
	!existsSync(join(nextDirectory, "standalone", "apps", "web", "server.js"))
) {
	throw new Error(
		"The Catalog production build did not create its self hostable standalone output.",
	);
}

function filesIn(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? filesIn(path) : [path];
	});
}

function totalBytes(paths: string[]) {
	return paths.reduce((total, path) => total + statSync(path).size, 0);
}

function assertWithinBudget(name: string, actual: number, maximum: number) {
	if (actual > maximum) {
		throw new Error(
			`${name} is ${actual} bytes, exceeding its ${maximum} byte ratchet. ` +
				"Update the Catalog performance budget only with an explicit architectural decision.",
		);
	}
}

const chunkPaths = filesIn(staticChunkDirectory);
const emittedJavaScriptBytes = totalBytes(
	chunkPaths.filter((path) => path.endsWith(".js")),
);
const emittedCssBytes = totalBytes(
	chunkPaths.filter((path) => path.endsWith(".css")),
);
const sharedInitialJavaScriptBytes = totalBytes(
	manifest.rootMainFiles.map((path) => join(nextDirectory, path)),
);

assertWithinBudget(
	"Shared initial JavaScript",
	sharedInitialJavaScriptBytes,
	budget.sharedInitialJavaScriptBytes,
);
assertWithinBudget(
	"Emitted JavaScript",
	emittedJavaScriptBytes,
	budget.emittedJavaScriptBytes,
);
assertWithinBudget("Emitted CSS", emittedCssBytes, budget.emittedCssBytes);

console.log(
	`Catalog budget passed: ${sharedInitialJavaScriptBytes} B shared initial JavaScript, ${emittedJavaScriptBytes} B emitted JavaScript, ${emittedCssBytes} B emitted CSS.`,
);

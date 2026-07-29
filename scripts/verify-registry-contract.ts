import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { launchSetNames } from "./launch-set";

type RegistryItem = {
	dependencies?: string[];
	docs?: string;
	files?: Array<{ content?: string; path: string; target?: string }>;
	meta?: { lifecycle?: string; sourceUrl?: string };
	name: string;
	registryDependencies?: string[];
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const payloadDirectory = join(repositoryRoot, "apps", "web", "public", "r");
const requiredDocumentationSections = [
	"Dependencies and client boundary",
	"Accessibility",
	"Motion and performance",
	"Consumer Theme",
	"Responsive, localization, and RTL",
	"Compatibility",
];
const prohibitedSourcePatterns = [
	{ name: "remote URL", pattern: /https?:\/\// },
	{ name: "network request", pattern: /\bfetch\s*\(/ },
	{ name: "analytics beacon", pattern: /\bsendBeacon\s*\(/ },
	{ name: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/ },
	{ name: "WebSocket", pattern: /\bWebSocket\b/ },
	{ name: "idle interval", pattern: /\bsetInterval\s*\(/ },
	{ name: "animation frame loop", pattern: /\brequestAnimationFrame\s*\(/ },
];

function fail(message: string): never {
	throw new Error(`Registry contract failed: ${message}`);
}

function readPayload(name: string) {
	return JSON.parse(
		readFileSync(join(payloadDirectory, `${name}.json`), "utf8"),
	) as RegistryItem;
}

function hasSameValues(first: unknown, second: unknown) {
	return JSON.stringify(first) === JSON.stringify(second);
}

function verifyDocumentation(item: RegistryItem) {
	if (!item.docs) {
		fail(`${item.name} has no documentation.`);
	}

	for (const section of requiredDocumentationSections) {
		if (!item.docs.includes(`## ${section}`)) {
			fail(`${item.name} is missing its ${section} documentation.`);
		}
	}
}

function verifyInstalledSource(item: RegistryItem) {
	if (!item.files?.length) {
		fail(`${item.name} has no installable source file.`);
	}

	for (const file of item.files) {
		if (!file.target?.startsWith("components/aeri/")) {
			fail(`${item.name} does not install into the Aeri owned source path.`);
		}
		if (!file.content) {
			fail(`${item.name} did not generate source content for ${file.path}.`);
		}

		const sourcePath = join(repositoryRoot, file.path);
		if (!existsSync(sourcePath)) {
			fail(`${item.name} references missing source ${file.path}.`);
		}
		if (readFileSync(sourcePath, "utf8") !== file.content) {
			fail(`${item.name} generated output drifted from ${file.path}.`);
		}

		for (const prohibited of prohibitedSourcePatterns) {
			if (prohibited.pattern.test(file.content)) {
				fail(`${item.name} source contains prohibited ${prohibited.name}.`);
			}
		}
		if (/(@aeri-ui\/ui|@\/lib\/|apps\/web|packages\/ui)/.test(file.content)) {
			fail(`${item.name} source depends on a private Catalog workspace path.`);
		}

		for (const moduleName of file.content.matchAll(
			/from\s+["']([^"']+)["']/g,
		)) {
			if (moduleName[1]?.startsWith("@/")) {
				continue;
			}
			const importedPackage = moduleName[1]?.startsWith("@")
				? moduleName[1].split("/").slice(0, 2).join("/")
				: moduleName[1]?.split("/")[0];
			if (
				importedPackage &&
				importedPackage !== "react" &&
				!item.dependencies?.includes(importedPackage)
			) {
				fail(
					`${item.name} does not declare its ${importedPackage} dependency.`,
				);
			}
		}
	}
}

const generatedRegistry = JSON.parse(
	readFileSync(join(payloadDirectory, "registry.json"), "utf8"),
) as { items: RegistryItem[] };
const generatedItems = new Map(
	generatedRegistry.items.map((item) => [item.name, item]),
);

if (generatedItems.size !== launchSetNames.length) {
	fail("the generated registry does not contain exactly the Launch Set.");
}

for (const name of launchSetNames) {
	const item = generatedItems.get(name);
	const payload = readPayload(name);
	if (!item) {
		fail(`${name} is missing from the generated registry.`);
	}
	if (payload.name !== name) {
		fail(`${name} does not resolve from its canonical registry address.`);
	}
	for (const property of [
		"dependencies",
		"docs",
		"meta",
		"registryDependencies",
	] as const) {
		if (!hasSameValues(payload[property], item[property])) {
			fail(`${name} endpoint payload drifted in ${property}.`);
		}
	}
	if (
		!item.meta?.lifecycle ||
		!["preview", "stable", "deprecated"].includes(item.meta.lifecycle)
	) {
		fail(`${name} has an invalid lifecycle.`);
	}
	if (
		item.meta.sourceUrl !==
		`https://github.com/arjayby/aeri-ui/tree/main/${item.files?.[0]?.path}`
	) {
		fail(`${name} does not expose its canonical source address.`);
	}

	verifyDocumentation(item);
	verifyInstalledSource(payload);
	for (const dependency of item.dependencies ?? []) {
		if (!item.docs?.includes(dependency)) {
			fail(`${name} does not document its ${dependency} dependency.`);
		}
	}

	for (const dependency of item.registryDependencies ?? []) {
		const dependencyName = dependency.replace("@aeri-ui/", "");
		if (!generatedItems.has(dependencyName)) {
			fail(`${name} declares unavailable Registry dependency ${dependency}.`);
		}
		if (!new RegExp(dependencyName, "i").test(item.docs)) {
			fail(`${name} does not document its ${dependency} Registry dependency.`);
		}
	}
}

try {
	execFileSync("git", ["diff", "--quiet", "--", "apps/web/public/r"], {
		cwd: repositoryRoot,
		stdio: "ignore",
	});
} catch {
	fail(
		"generated Registry payloads are out of date. Run pnpm run registry:build.",
	);
}

console.log("Registry contract passed.");

import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const standaloneDirectory = ".next/standalone/apps/web";
const requiredDirectories = ["public", ".next/static"];

for (const directory of requiredDirectories) {
	if (!existsSync(directory)) {
		throw new Error(`Expected ${directory} after the production build.`);
	}
	cpSync(directory, join(standaloneDirectory, directory), {
		force: true,
		recursive: true,
	});
}

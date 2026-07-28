import { defineConfig, devices } from "@playwright/test";

const webPort = Number(process.env.PLAYWRIGHT_PORT ?? 3001);

export default defineConfig({
	testDir: ".",
	testMatch: ["tests/catalog/**/*.spec.ts", "registry/**/*.spec.ts"],
	snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	use: {
		baseURL: `http://127.0.0.1:${webPort}`,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: `pnpm --filter web exec next start --port ${webPort}`,
		url: `http://127.0.0.1:${webPort}`,
		reuseExistingServer: !process.env.CI,
	},
});

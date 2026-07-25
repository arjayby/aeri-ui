import { defineConfig, devices } from "@playwright/test";

const webPort = 3001;

export default defineConfig({
	testDir: ".",
	testMatch: ["tests/catalog/**/*.spec.ts", "registry/**/*.spec.ts"],
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
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
		command: "pnpm --filter web start",
		url: `http://127.0.0.1:${webPort}`,
		reuseExistingServer: false,
	},
});

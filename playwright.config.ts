import { defineConfig, devices } from "@playwright/test";

const webPort = Number(process.env.PLAYWRIGHT_PORT ?? 3001);
const catalogCompatibility = /@catalog-compatibility/;

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
		{
			name: "chromium-narrow",
			grep: catalogCompatibility,
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 390, height: 844 },
			},
		},
		{
			name: "firefox",
			grep: catalogCompatibility,
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "firefox-narrow",
			grep: catalogCompatibility,
			use: {
				...devices["Desktop Firefox"],
				viewport: { width: 390, height: 844 },
			},
		},
		{
			name: "webkit",
			grep: catalogCompatibility,
			use: { ...devices["Desktop Safari"] },
		},
		{
			name: "webkit-narrow",
			grep: catalogCompatibility,
			use: {
				...devices["Desktop Safari"],
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: {
		command: `PORT=${webPort} HOSTNAME=127.0.0.1 node .next/standalone/apps/web/server.js`,
		cwd: "apps/web",
		url: `http://127.0.0.1:${webPort}`,
		reuseExistingServer: !process.env.CI,
	},
});

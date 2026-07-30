import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const representativeRoutes = [
	"/",
	"/components",
	"/docs",
	"/components/button",
] as const;
const initialScriptBudgetBytes = 500_000;
const interactionResponseBudgetMilliseconds = 200;

async function openSearch(page: Page) {
	const searchButton = page.getByRole("button", { name: "Search" });
	if (!(await searchButton.isVisible())) {
		await page.locator("header summary").click();
	}
	return searchButton;
}

test.describe("@catalog-compatibility Catalog production contract", () => {
	test("Builder can complete representative Catalog journeys", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(
			page.getByRole("heading", {
				name: "Polished interactions, ready to make yours.",
			}),
		).toBeVisible();

		await page.goto("/components");
		await page.getByRole("link", { name: "View Button" }).click();
		await expect(page).toHaveURL(/\/components\/button$/);
		await expect(
			page.getByRole("heading", { name: "Live preview" }),
		).toBeVisible();

		await page.goto("/docs");
		await (await openSearch(page)).click();
		await page.getByPlaceholder("Search").fill("Privacy");
		await page.getByRole("button", { name: "Privacy Notice" }).click();
		await expect(page).toHaveURL(/\/docs\/privacy$/);
	});

	test("Builder can operate the Button Live Preview by keyboard", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/components/button");
		const preview = page.locator("[data-button-preview]");
		const button = preview.getByRole("button", { name: "Save changes" });

		await page.getByText("Controls", { exact: true }).click();
		await button.focus();
		await expect(button).toBeFocused();
		await button.press("Enter");
		await expect(preview.getByRole("status")).toHaveText("Action acknowledged");

		await page.getByLabel("Text direction").selectOption("rtl");
		await expect(preview).toHaveAttribute("dir", "rtl");
	});

	test("representative routes have no automated accessibility violations", async ({
		page,
	}) => {
		for (const route of representativeRoutes) {
			await page.goto(route);
			const results = await new AxeBuilder({ page }).analyze();
			expect(
				results.violations,
				`${route} accessibility violations: ${results.violations
					.map((violation) => violation.id)
					.join(", ")}`,
			).toEqual([]);
		}
	});

	test("registry payloads revalidate from their canonical addresses", async ({
		request,
	}) => {
		const response = await request.get("/r/button.json");

		expect(response.ok()).toBeTruthy();
		expect(response.headers()["cache-control"]).toBe(
			"public, max-age=0, must-revalidate",
		);
	});

	test("narrow viewports retain a usable inline layout", async ({ page }) => {
		await page.goto("/components/button");

		const dimensions = await page.evaluate(() => ({
			documentWidth: document.documentElement.scrollWidth,
			viewportWidth: window.innerWidth,
		}));

		expect(dimensions.documentWidth).toBeLessThanOrEqual(
			dimensions.viewportWidth,
		);
		await expect(
			page.getByRole("heading", { name: "Live preview" }),
		).toBeVisible();
	});

	test("the landing route does not load more than its initial script budget", async ({
		page,
	}) => {
		await page.goto("/");
		const scriptBytes = await page.evaluate(() =>
			performance
				.getEntriesByType("resource")
				.filter(
					(entry) =>
						entry instanceof PerformanceResourceTiming &&
						entry.initiatorType === "script",
				)
				.reduce(
					(total, entry) =>
						total + (entry as PerformanceResourceTiming).transferSize,
					0,
				),
		);

		expect(scriptBytes).toBeLessThanOrEqual(initialScriptBudgetBytes);
	});

	test("local search responds within the interaction budget", async ({
		page,
	}) => {
		await page.goto("/docs");
		await openSearch(page);
		const responseTime = await page.evaluate(
			({ budget }) =>
				new Promise<number>((resolve, reject) => {
					const searchButton = document.querySelector<HTMLButtonElement>(
						'button[aria-label="Search"]',
					);
					if (!searchButton) {
						reject(new Error("Search button is unavailable"));
						return;
					}

					const startedAt = performance.now();
					const observer = new MutationObserver(() => {
						if (
							document.querySelector(
								'[role="status"], input[placeholder="Search"]',
							)
						) {
							observer.disconnect();
							resolve(performance.now() - startedAt);
						}
					});

					observer.observe(document.body, { childList: true, subtree: true });
					searchButton.click();
					setTimeout(() => {
						observer.disconnect();
						reject(new Error("Search did not render a response in time"));
					}, budget);
				}),
			{ budget: interactionResponseBudgetMilliseconds },
		);

		expect(responseTime).toBeLessThanOrEqual(
			interactionResponseBudgetMilliseconds,
		);
		await expect(page.getByPlaceholder("Search")).toBeVisible();
	});
});

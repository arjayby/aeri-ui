import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Builder can evaluate Tabs and move between panels", async ({
	page,
	request,
}) => {
	const response = await request.get("/r/tabs.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "tabs",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/tabs.tsx",
			},
		],
	});

	await page.goto("/components/tabs");

	await expect(
		page.getByRole("heading", { exact: true, name: "Tabs" }),
	).toBeVisible();
	await expect(page.getByText("Preview", { exact: true })).toBeVisible();
	await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await expect(page.getByRole("tabpanel", { name: "Overview" })).toContainText(
		"Plan your next move",
	);

	await page.getByRole("tab", { name: "Activity" }).click();
	await expect(page.getByRole("tabpanel", { name: "Activity" })).toContainText(
		"No recent activity",
	);
	expect(
		await page
			.getByRole("tabpanel", { name: "Activity" })
			.evaluate((panel) =>
				getComputedStyle(panel).transitionProperty.includes("translate"),
			),
	).toBe(true);
	await expect(page.locator("[data-aeri-tabs-indicator]")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "API reference" }),
	).toBeVisible();
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Orientation").selectOption("vertical");
	await expect(page.locator("[data-slot=aeri-tabs-list]")).toHaveAttribute(
		"data-orientation",
		"vertical",
	);
	await expect(page.locator("[data-aeri-tabs-indicator]")).toHaveAttribute(
		"data-orientation",
		"vertical",
	);
	await page.getByLabel("Text direction").selectOption("rtl");
	await expect(page.locator("[data-tabs-preview]")).toHaveAttribute(
		"dir",
		"rtl",
	);
	await page.getByLabel("Viewport").selectOption("compact");
	await expect(page.locator("[data-tabs-preview]")).toHaveCSS(
		"max-width",
		"320px",
	);

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Builder can navigate Tabs by keyboard in reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/tabs");

	const overview = page.getByRole("tab", { name: "Overview" });
	await overview.focus();
	await page.keyboard.press("ArrowRight");

	await expect(page.getByRole("tab", { name: "Activity" })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("tabpanel", { name: "Activity" })).toContainText(
		"No recent activity",
	);
	await expect(page.locator("[data-aeri-tabs-indicator]")).toHaveCSS(
		"transition-property",
		"none",
	);
});

test("Tabs responds quickly and settles without recurring animation work", async ({
	page,
}) => {
	await page.goto("/components/tabs");

	const activity = page.getByRole("tab", { name: "Activity" });
	await activity.evaluate((element) => {
		element.addEventListener(
			"pointerdown",
			() => {
				const startedAt = performance.now();
				let largestFrame = 0;
				let previousFrame = startedAt;

				requestAnimationFrame((frameTime) => {
					element.setAttribute(
						"data-response-time",
						String(frameTime - startedAt),
					);

					const measureFrame = (nextFrameTime: number) => {
						largestFrame = Math.max(
							largestFrame,
							nextFrameTime - previousFrame,
						);
						previousFrame = nextFrameTime;

						if (nextFrameTime - startedAt < 300) {
							requestAnimationFrame(measureFrame);
							return;
						}

						element.setAttribute("data-largest-frame", String(largestFrame));
					};

					requestAnimationFrame(measureFrame);
				});
			},
			{ once: true },
		);
	});

	await activity.click();
	await expect(activity).toHaveAttribute("data-response-time", /\d/);
	expect(
		Number(await activity.getAttribute("data-response-time")),
	).toBeLessThan(100);
	await expect(page.getByRole("tabpanel", { name: "Activity" })).toBeVisible();
	await page.waitForTimeout(300);
	await expect(activity).toHaveAttribute("data-largest-frame", /\d/);
	expect(
		Number(await activity.getAttribute("data-largest-frame")),
	).toBeLessThan(50);
	expect(
		await page
			.locator("[data-tabs-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

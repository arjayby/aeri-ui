import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Builder can retrieve the generated Tooltip registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/tooltip.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "tooltip",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/tooltip.tsx",
			},
		],
	});
});

test("Builder can open and dismiss Tooltip by hover and focus", async ({
	page,
}) => {
	await page.goto("/components/tooltip");

	await expect(
		page.getByRole("heading", { exact: true, name: "Tooltip" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();

	const trigger = page.getByRole("button", { name: "More information" });
	await trigger.hover();
	const tooltip = page.getByRole("tooltip");
	await expect(tooltip).toContainText("Visible after a short delay");
	await expect(tooltip).toHaveAttribute("id", "more-information-description");
	await expect(trigger).toHaveAttribute(
		"aria-describedby",
		"more-information-description",
	);
	await page.keyboard.press("Escape");
	await expect(tooltip).not.toBeVisible();
	await expect(trigger).not.toHaveAttribute("aria-describedby");

	await page.mouse.move(0, 0);
	await page.keyboard.press("Tab");
	await trigger.focus();
	await expect(tooltip).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(tooltip).not.toBeVisible();

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Placement").selectOption("bottom");
	await trigger.hover();
	await expect(tooltip).toHaveAttribute("data-side", "bottom");
	await page.mouse.move(0, 0);
	await expect(tooltip).not.toBeVisible();

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Tooltip respects reduced motion and settles without active animation", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/tooltip");

	const trigger = page.getByRole("button", { name: "More information" });
	await trigger.focus();
	const tooltip = page.getByRole("tooltip");
	await expect(tooltip).toBeVisible();
	await expect(tooltip).toHaveCSS("transition-property", "none");
	await page.keyboard.press("Escape");
	await page.waitForTimeout(300);
	expect(
		await page
			.locator("[data-tooltip-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

test("Tooltip responds quickly and settles without recurring animation work", async ({
	page,
}) => {
	await page.goto("/components/tooltip");

	const trigger = page.getByRole("button", { name: "More information" });
	await trigger.evaluate((element) => {
		element.addEventListener(
			"focus",
			() => {
				const startedAt = performance.now();
				let largestFrame = 0;
				let previousFrame = startedAt;

				requestAnimationFrame((frameTime) => {
					element.setAttribute(
						"data-response-time",
						String(frameTime - startedAt),
					);

					const measureFrame = (currentFrame: number) => {
						largestFrame = Math.max(largestFrame, currentFrame - previousFrame);
						previousFrame = currentFrame;

						if (currentFrame - startedAt < 450) {
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

	await trigger.focus();
	await expect(page.getByRole("tooltip")).toBeVisible();
	await expect(trigger).toHaveAttribute("data-response-time", /\d/);
	expect(Number(await trigger.getAttribute("data-response-time"))).toBeLessThan(
		100,
	);
	await expect(trigger).toHaveAttribute("data-largest-frame", /\d/);
	expect(Number(await trigger.getAttribute("data-largest-frame"))).toBeLessThan(
		50,
	);
	await page.waitForTimeout(300);
	expect(
		await page
			.locator("[data-tooltip-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

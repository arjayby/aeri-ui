import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Builder can retrieve the generated Switch registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/switch.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "switch",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/switch.tsx",
			},
		],
	});
});

test("Builder can evaluate Switch and submit its form value", async ({
	page,
}) => {
	await page.goto("/components/switch");

	await expect(
		page.getByRole("heading", { exact: true, name: "Switch" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();

	const switchControl = page.getByRole("switch", {
		name: "Enable release notifications",
	});
	await expect(switchControl).toHaveAttribute("aria-checked", "false");
	await switchControl.click();
	await expect(switchControl).toHaveAttribute("aria-checked", "true");
	await page.getByRole("button", { name: "Save preferences" }).click();
	await expect(page.getByRole("status")).toHaveText(
		"Release note preference saved: on",
	);

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Text direction").selectOption("rtl");
	await expect(page.locator("[data-switch-preview]")).toHaveAttribute(
		"dir",
		"rtl",
	);
	const thumb = page.locator('[data-slot="aeri-switch-thumb"]');
	await page.waitForTimeout(200);
	const checkedLeft = await thumb.evaluate(
		(element) => element.getBoundingClientRect().left,
	);
	await switchControl.click();
	await page.waitForTimeout(200);
	const uncheckedLeft = await thumb.evaluate(
		(element) => element.getBoundingClientRect().left,
	);
	expect(checkedLeft).toBeLessThan(uncheckedLeft);
	await page.getByLabel("Viewport").selectOption("compact");
	await expect(page.locator("[data-switch-preview]")).toHaveCSS(
		"max-width",
		"320px",
	);
	await page.getByLabel("Consumer Theme").selectOption("night");
	await expect(page.locator("[data-switch-preview]")).toHaveAttribute(
		"data-consumer-theme",
		"night",
	);

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Builder can operate Switch by keyboard with reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
	await page.goto("/components/switch");

	const switchControl = page.getByRole("switch", {
		name: "Enable release notifications",
	});
	await switchControl.focus();
	expect(
		await switchControl.evaluate((element) =>
			element.matches(":focus-visible"),
		),
	).toBe(true);
	await expect(switchControl).toHaveCSS("outline-style", "solid");
	await expect(switchControl).toHaveCSS("forced-color-adjust", "auto");
	await page.keyboard.press("Space");
	await expect(switchControl).toHaveAttribute("aria-checked", "true");
	await expect(page.locator('[data-slot="aeri-switch-thumb"]')).toHaveCSS(
		"transition-property",
		"none",
	);

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Disabled").check();
	await expect(switchControl).toHaveAttribute("data-disabled", "");
});

test("Switch responds within the interaction budget and settles", async ({
	page,
}) => {
	await page.goto("/components/switch");
	const switchControl = page.getByRole("switch", {
		name: "Enable release notifications",
	});
	const box = await switchControl.boundingBox();
	if (!box) {
		throw new Error("The Switch control does not have a visible box.");
	}
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	expect(
		await switchControl.evaluate((element) => getComputedStyle(element).scale),
	).toBe("0.95");
	await page.mouse.up();

	await switchControl.evaluate((element) => {
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
	await switchControl.click();

	await expect(switchControl).toHaveAttribute("data-response-time", /\d/);
	expect(
		Number(await switchControl.getAttribute("data-response-time")),
	).toBeLessThan(100);
	await expect(switchControl).toHaveAttribute("data-largest-frame", /\d/);
	expect(
		Number(await switchControl.getAttribute("data-largest-frame")),
	).toBeLessThan(50);
	await page.waitForTimeout(300);
	expect(
		await page
			.locator("[data-switch-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

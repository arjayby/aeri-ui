import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Builder can retrieve the generated Accordion registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/accordion.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "accordion",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/accordion.tsx",
			},
		],
	});
});

test("Builder can evaluate Accordion from its Item Page", async ({ page }) => {
	await page.goto("/components/accordion");

	await expect(
		page.getByRole("heading", { exact: true, name: "Accordion" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();

	const trigger = page.getByRole("button", {
		name: "When will my order arrive?",
	});
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
	await trigger.click();
	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	await expect(
		page.getByRole("region", { name: "When will my order arrive?" }),
	).toContainText("three to five business days");

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Allow multiple sections").check();
	await page
		.getByRole("button", { name: "Can I change my delivery address?" })
		.click();
	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	await expect(
		page.getByRole("button", { name: "Can I change my delivery address?" }),
	).toHaveAttribute("aria-expanded", "true");

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Builder can operate Accordion by keyboard with reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/accordion");

	const trigger = page.getByRole("button", {
		name: "When will my order arrive?",
	});
	await trigger.focus();
	expect(
		await trigger.evaluate((element) => element.matches(":focus-visible")),
	).toBe(true);
	await expect(trigger).toHaveCSS("outline-style", "solid");
	await page.keyboard.press("Space");
	await expect(trigger).toHaveAttribute("aria-expanded", "true");
	await expect(
		page.getByRole("region", { name: "When will my order arrive?" }),
	).toHaveCSS("transition-property", "none");

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Disabled").check();
	await expect(trigger).toBeDisabled();
	await page.getByLabel("Text direction").selectOption("rtl");
	const preview = page.locator("[data-accordion-preview]");
	await expect(preview).toHaveAttribute("dir", "rtl");
	await expect(trigger).toHaveCSS("text-align", "start");
	await page.getByLabel("Viewport").selectOption("compact");
	await expect(preview).toHaveCSS("max-width", "320px");
});

test("Accordion responds within the interaction budget and settles", async ({
	page,
}) => {
	await page.goto("/components/accordion");

	const trigger = page.getByRole("button", {
		name: "When will my order arrive?",
	});
	await page.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			),
	);
	await trigger.click();
	await page.waitForTimeout(250);
	await trigger.click();
	await page.waitForTimeout(250);
	await trigger.evaluate((element) => {
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
	await trigger.click();

	await expect(trigger).toHaveAttribute("data-response-time", /\d/);
	expect(Number(await trigger.getAttribute("data-response-time"))).toBeLessThan(
		100,
	);
	await expect(trigger).toHaveAttribute("data-largest-frame", /\d/);
	expect(Number(await trigger.getAttribute("data-largest-frame"))).toBeLessThan(
		50,
	);
	await page.getByRole("button", { name: "Show delivery detail" }).click();
	await expect(
		page.getByText("Delivery estimates update when an order includes"),
	).toBeVisible();
	await page.waitForTimeout(300);
	expect(
		await page
			.locator("[data-accordion-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

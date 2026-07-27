import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Builder can retrieve the generated Button registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/button.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "button",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/button.tsx",
			},
		],
	});
});

test("Builder can evaluate Button and choose an installation command", async ({
	page,
	context,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/components/button");

	await expect(
		page.getByRole("heading", { exact: true, name: "Button" }),
	).toBeVisible();
	await expect(page.getByText("Preview", { exact: true })).toBeVisible();
	await expect(page.getByText("New", { exact: true })).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Save changes" }),
	).toBeVisible();
	await expect(
		page.getByText("npx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await page.getByRole("tab", { exact: true, name: "pnpm" }).click();
	await expect(
		page.getByText("pnpm dlx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await page.getByRole("tab", { exact: true, name: "yarn" }).click();
	await expect(
		page.getByText("yarn dlx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await page.getByRole("tab", { exact: true, name: "bun" }).click();
	await expect(
		page.getByText("bunx --bun shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await page.getByText("Controls", { exact: true }).click();
	await expect(page.getByLabel("Consumer Theme")).toBeVisible();
	await expect(page.getByLabel("Content language")).toBeVisible();
	await expect(page.getByLabel("Button variant")).toBeVisible();
	await expect(page.getByLabel("Disabled")).toBeVisible();
	await expect(page.getByLabel("Text direction")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Copy bun installation command" }),
	).toBeVisible();
	await page
		.getByRole("button", { name: "Copy bun installation command" })
		.click();
	await expect(
		page.getByRole("button", { name: "Copied bun installation command" }),
	).toBeVisible();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		"bunx --bun shadcn@latest add @aeri-ui/button",
	);
	await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "API reference" }),
	).toBeVisible();
	await expect(page.getByRole("cell", { name: "variant" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Accessibility" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Motion and performance" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Consumer Theme" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Responsive, localization, and RTL" }),
	).toBeVisible();

	await page.getByLabel("Button variant").selectOption("secondary");
	await expect(
		page.getByRole("button", { name: "Save changes" }),
	).toHaveAttribute("data-variant", "secondary");
	await page.getByLabel("Text direction").selectOption("rtl");
	await expect(page.locator("[data-button-preview]")).toHaveAttribute(
		"dir",
		"rtl",
	);
	await page.getByLabel("Viewport").selectOption("compact");
	await expect(page.locator("[data-button-preview]")).toHaveCSS(
		"max-width",
		"320px",
	);
	await page.getByLabel("Consumer Theme").selectOption("night");
	await expect(page.locator("[data-button-preview]")).toHaveAttribute(
		"data-consumer-theme",
		"night",
	);

	await page.getByRole("button", { name: "Save changes" }).click();

	await expect(
		page.getByRole("button", { name: "Saving changes" }),
	).toHaveAttribute("aria-busy", "true");
	await expect(page.getByRole("status")).toHaveText("Action acknowledged");
});

test("Builder can operate Button with the keyboard and reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/button");

	const button = page.getByRole("button", { name: "Save changes" });
	await button.focus();
	expect(
		await button.evaluate((element) => element.matches(":focus-visible")),
	).toBe(true);
	await expect(button).toHaveCSS("outline-style", "solid");
	await page.keyboard.press("Enter");

	await expect(page.getByRole("status")).toHaveText("Action acknowledged");
	await expect(button).toHaveCSS("transition-property", "none");
	await button.focus();
	await page.keyboard.press("Space");
	await expect(
		page.getByRole("button", { name: "Saving changes" }),
	).toHaveAttribute("aria-busy", "true");
	await expect(page.getByRole("status")).toHaveText("Action acknowledged");

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Disabled").check();
	await expect(button).toBeDisabled();
});

test("Button responds and animates within the interaction budgets", async ({
	page,
}) => {
	await page.goto("/components/button");
	await page.getByText("Controls", { exact: true }).click();

	const button = page.getByRole("button", { name: "Save changes" });
	await button.evaluate((element) => {
		element.addEventListener(
			"pointerdown",
			() => {
				const startedAt = performance.now();
				let largestFrame = 0;
				let previousFrame = startedAt;

				requestAnimationFrame((firstFrame) => {
					element.setAttribute(
						"data-response-time",
						String(firstFrame - startedAt),
					);

					const measureFrame = (frameTime: number) => {
						largestFrame = Math.max(largestFrame, frameTime - previousFrame);
						previousFrame = frameTime;

						if (frameTime - startedAt < 450) {
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
	await button.click();

	await expect(button).toHaveAttribute("data-response-time", /\d/);
	const responseTime = Number(await button.getAttribute("data-response-time"));
	expect(responseTime).toBeLessThan(100);
	await expect(page.getByRole("status")).toHaveText("Action acknowledged");
	await expect(button).toHaveAttribute("data-largest-frame", /\d/);
	const largestFrame = Number(await button.getAttribute("data-largest-frame"));
	expect(largestFrame).toBeLessThan(50);
	await expect(button).toHaveText("Save changes");
	expect(
		await page
			.locator("[data-button-preview]")
			.evaluate((preview) => preview.getAnimations({ subtree: true }).length),
	).toBe(0);
});

test("Builder can inspect localized Button content without accessibility violations", async ({
	page,
}) => {
	await page.goto("/components/button");
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Content language").selectOption("arabic");

	await expect(
		page.getByRole("button", { name: "حفظ التغييرات" }),
	).toBeVisible();
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

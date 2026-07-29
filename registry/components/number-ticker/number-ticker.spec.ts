import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Builder can retrieve the generated Number Ticker registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/number-ticker.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "number-ticker",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/number-ticker.tsx",
			},
		],
	});
});

test("Builder can evaluate formatted Number Ticker values", async ({
	page,
}) => {
	await page.goto("/components/number-ticker");

	await expect(
		page.getByRole("heading", { exact: true, name: "Number Ticker" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();

	const ticker = page.locator('[data-slot="aeri-number-ticker"]');
	await expect(ticker).toHaveAttribute("data-value", "12450.75");
	await expect(ticker).toContainText("$12,450.75");

	await page.getByRole("button", { name: "Increase value" }).click();
	await expect(ticker).toHaveAttribute("data-direction", "up");
	await expect(ticker).toHaveAttribute("data-value", "37131");

	await page.getByRole("button", { name: "Decrease value" }).click();
	await expect(ticker).toHaveAttribute("data-direction", "down");
	await expect(ticker).toHaveAttribute("data-value", "12450.75");

	await page.getByText("Controls", { exact: true }).click();
	await expect(page.getByLabel("Format")).toBeVisible();
	await page.getByLabel("Format").selectOption("compact");
	await expect(ticker).toContainText("12K");
	await page.getByLabel("Format").selectOption("currency");
	await page.getByLabel("Example value").selectOption("large");
	await expect(ticker).toHaveAttribute("data-value", "987654321.12");
	await page.getByLabel("Example value").selectOption("negative");
	await expect(ticker).toHaveAttribute("data-value", "-4200.5");
	await page.getByLabel("Locale").selectOption("de-DE");
	await expect(ticker).toContainText("-4.200,50");

	await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "API reference" }),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { exact: true, name: "formatOptions" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Accessibility" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Motion and performance" }),
	).toBeVisible();
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Number Ticker communicates one final value in reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/number-ticker");

	const ticker = page.locator('[data-slot="aeri-number-ticker"]');
	await expect(ticker).toHaveAttribute("aria-live", "polite");
	await expect(ticker).toHaveAttribute("aria-atomic", "true");
	await expect(
		ticker.locator('[data-slot="aeri-number-ticker-value"]'),
	).toHaveAttribute("aria-hidden", "true");

	await page.getByRole("button", { name: "Increase value" }).click();
	await expect(ticker).toHaveAttribute("data-value", "37131");
	await expect(ticker).toContainText("$37,131.00");
	expect(
		await ticker.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);

	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.reload();
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Reduced motion").check();
	await page.getByRole("button", { name: "Increase value" }).click();
	expect(
		await ticker.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);
});

test("Number Ticker responds within its frame budget and settles without a layout jump", async ({
	page,
}) => {
	await page.goto("/components/number-ticker");

	const ticker = page.locator('[data-slot="aeri-number-ticker"]');
	const increase = page.getByRole("button", { name: "Increase value" });
	await increase.evaluate((element) => {
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
	await increase.click();

	await expect(increase).toHaveAttribute("data-response-time", /\d/);
	expect(
		Number(await increase.getAttribute("data-response-time")),
	).toBeLessThan(100);
	await expect(increase).toHaveAttribute("data-largest-frame", /\d/);
	expect(
		Number(await increase.getAttribute("data-largest-frame")),
	).toBeLessThan(50);
	expect(
		await ticker.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);

	await page.getByText("Controls", { exact: true }).click();
	const layout = ticker.locator('[data-slot="aeri-number-ticker-layout"]');
	const previousWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);
	const exampleSelect = page.getByLabel("Example value");
	await exampleSelect.evaluate((element) => {
		element.addEventListener(
			"change",
			() => {
				const startedAt = performance.now();
				let largestFrame = 0;
				let previousFrame = startedAt;

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
			},
			{ once: true },
		);
	});
	await exampleSelect.selectOption("large");
	await expect(ticker).toHaveAttribute("data-value", "987654321.12");
	const widthKeyframes = await layout.evaluate((element) =>
		element
			.getAnimations()
			.flatMap((animation) => animation.effect?.getKeyframes() ?? [])
			.map((keyframe) => keyframe.width)
			.filter((width): width is string => typeof width === "string"),
	);
	expect(widthKeyframes).toHaveLength(2);
	expect(Number.parseFloat(widthKeyframes[0] ?? "")).toBeCloseTo(
		previousWidth,
		0,
	);
	await expect(exampleSelect).toHaveAttribute("data-largest-frame", /\d/);
	expect(
		Number(await exampleSelect.getAttribute("data-largest-frame")),
	).toBeLessThan(50);
	expect(
		await ticker.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);
	expect(await layout.evaluate((element) => element.style.width)).toBe("");

	await page.getByLabel("Example value").selectOption("negative");
	await page.waitForTimeout(100);
	const interruptedWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);
	await page.getByLabel("Example value").selectOption("decimal");
	await expect(ticker).toHaveAttribute("data-value", "12450.75");
	const interruptedKeyframes = await layout.evaluate((element) =>
		element
			.getAnimations()
			.flatMap((animation) => animation.effect?.getKeyframes() ?? [])
			.map((keyframe) => keyframe.width)
			.filter((width): width is string => typeof width === "string"),
	);
	expect(
		Math.abs(
			Number.parseFloat(interruptedKeyframes[0] ?? "") - interruptedWidth,
		),
	).toBeLessThan(10);
	await page.waitForTimeout(450);

	const settledWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);
	await ticker.evaluate((element) => {
		element.style.fontSize = "80px";
	});
	expect(
		await layout.evaluate((element) => element.getBoundingClientRect().width),
	).toBeGreaterThan(settledWidth);
});

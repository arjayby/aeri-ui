import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Builder can retrieve the generated Text Swap registry payload", async ({
	request,
}) => {
	const response = await request.get("/r/text-swap.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "text-swap",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/text-swap.tsx",
			},
		],
	});
});

test("Builder can swap short, long, and localized Text Swap content", async ({
	page,
}) => {
	await page.goto("/components/text-swap");

	await expect(
		page.getByRole("heading", { exact: true, name: "Text Swap" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();

	const textSwap = page.locator('[data-slot="aeri-text-swap"]');
	await expect(textSwap).toHaveAttribute("role", "status");
	await expect(textSwap).toHaveAttribute("aria-live", "polite");
	await expect(textSwap).toContainText("Ready");

	await page.getByRole("button", { name: "Show processing status" }).click();
	await expect(textSwap).toHaveAttribute("data-key", "processing");
	await expect(textSwap).toContainText("Processing your request");

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Example status").selectOption("localized");
	await expect(textSwap).toHaveAttribute("data-key", "localized");
	await expect(textSwap).toContainText("Ihre Anfrage wird verarbeitet");

	await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "API reference" }),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { exact: true, name: "content" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Accessibility" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Motion and performance" }),
	).toBeVisible();
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Text Swap preserves layout, responds promptly, and stops after settling", async ({
	page,
}) => {
	await page.goto("/components/text-swap");

	const textSwap = page.locator('[data-slot="aeri-text-swap"]');
	const layout = textSwap.locator('[data-slot="aeri-text-swap-layout"]');
	const processing = page.getByRole("button", {
		name: "Show processing status",
	});
	const readyWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);

	await processing.evaluate((element) => {
		element.addEventListener(
			"pointerdown",
			() => {
				const startedAt = performance.now();
				const textSwap = document.querySelector('[data-slot="aeri-text-swap"]');
				let largestFrame = 0;
				let previousFrame = startedAt;

				const measureResponse = (currentFrame: number) => {
					const hasRenderedIncomingContent =
						textSwap?.getAttribute("data-key") === "processing" &&
						textSwap.getAnimations({ subtree: true }).length > 0;

					if (!hasRenderedIncomingContent) {
						requestAnimationFrame(measureResponse);
						return;
					}

					element.setAttribute(
						"data-response-time",
						String(currentFrame - startedAt),
					);
				};

				const measureFrame = (currentFrame: number) => {
					largestFrame = Math.max(largestFrame, currentFrame - previousFrame);
					previousFrame = currentFrame;

					if (currentFrame - startedAt < 450) {
						requestAnimationFrame(measureFrame);
						return;
					}

					element.setAttribute("data-largest-frame", String(largestFrame));
				};

				requestAnimationFrame(measureResponse);
				requestAnimationFrame(measureFrame);
			},
			{ once: true },
		);
	});
	await processing.click();

	await expect(processing).toHaveAttribute("data-response-time", /\d/);
	expect(
		Number(await processing.getAttribute("data-response-time")),
	).toBeLessThan(100);
	const widthKeyframes = await layout.evaluate((element) =>
		element
			.getAnimations()
			.flatMap((animation) => animation.effect?.getKeyframes() ?? [])
			.map((keyframe) => keyframe.width)
			.filter((width): width is string => typeof width === "string"),
	);
	expect(widthKeyframes).toHaveLength(2);
	expect(Number.parseFloat(widthKeyframes[0] ?? "")).toBeCloseTo(readyWidth, 0);
	await expect(processing).toHaveAttribute("data-largest-frame", /\d/);
	expect(
		Number(await processing.getAttribute("data-largest-frame")),
	).toBeLessThan(50);

	const statusSelect = page.getByLabel("Example status");
	const processingWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);
	await statusSelect.selectOption("review");
	const longKeyframes = await layout.evaluate((element) =>
		element
			.getAnimations()
			.flatMap((animation) => animation.effect?.getKeyframes() ?? [])
			.map((keyframe) => keyframe.width)
			.filter((width): width is string => typeof width === "string"),
	);
	expect(longKeyframes).toHaveLength(2);
	expect(Number.parseFloat(longKeyframes[0] ?? "")).toBeCloseTo(
		processingWidth,
		0,
	);

	await page.waitForTimeout(450);
	const longWidth = await layout.evaluate(
		(element) => element.getBoundingClientRect().width,
	);
	await statusSelect.selectOption("localized");
	const localizedKeyframes = await layout.evaluate((element) =>
		element
			.getAnimations()
			.flatMap((animation) => animation.effect?.getKeyframes() ?? [])
			.map((keyframe) => keyframe.width)
			.filter((width): width is string => typeof width === "string"),
	);
	expect(localizedKeyframes).toHaveLength(2);
	expect(Number.parseFloat(localizedKeyframes[0] ?? "")).toBeCloseTo(
		longWidth,
		0,
	);

	await page.waitForTimeout(450);
	expect(
		await textSwap.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);
	expect(await layout.evaluate((element) => element.style.width)).toBe("");
});

test("Text Swap changes content immediately when motion is reduced", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/text-swap");

	const textSwap = page.locator('[data-slot="aeri-text-swap"]');
	await page.getByRole("button", { name: "Show processing status" }).click();
	await expect(textSwap).toContainText("Processing your request");
	expect(
		await textSwap.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);

	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.reload();
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Reduced motion").check();
	await page.getByRole("button", { name: "Show processing status" }).click();
	expect(
		await textSwap.evaluate(
			(element) => element.getAnimations({ subtree: true }).length,
		),
	).toBe(0);
});

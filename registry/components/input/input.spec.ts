import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Builder can evaluate Input validation feedback and retrieve its registry payload", async ({
	page,
	request,
}) => {
	const response = await request.get("/r/input.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "input",
		type: "registry:ui",
		files: [
			{
				target: "components/aeri/input.tsx",
			},
		],
	});

	await page.goto("/components/input");
	await expect(
		page.getByRole("heading", { exact: true, name: "Input" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "View changelog" }),
	).toBeVisible();

	const input = page.getByRole("textbox", { name: "Email address" });
	await input.focus();
	expect(
		await input.evaluate((element) => element.matches(":focus-visible")),
	).toBe(true);
	await expect(input).toHaveCSS("outline-style", "solid");
	await expect(input).toHaveAttribute("autocomplete", "email");
	await expect(input).toHaveAttribute("required", "");

	await input.fill("");
	await page.getByRole("button", { name: "Save email" }).click();
	await expect(page.locator("p[role=alert]")).toHaveText(
		"Enter an email address before saving.",
	);
	await expect(input).toHaveAttribute("aria-invalid", "true");

	await input.fill("grace@");
	await page.getByRole("button", { name: "Save email" }).click();
	await expect(page.locator("p[role=alert]")).toHaveText(
		"Enter a complete email address.",
	);

	await input.fill("grace@example.com");
	await page.getByRole("button", { name: "Save email" }).click();
	await expect(page.getByRole("status")).toHaveText("Email saved.");
	await expect(input).toHaveAttribute("aria-invalid", "false");

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Text direction").selectOption("rtl");
	await expect(page.locator("[data-input-preview]")).toHaveAttribute(
		"dir",
		"rtl",
	);
	await page.getByLabel("Content language").selectOption("arabic");
	await expect(
		page.getByRole("textbox", { name: "البريد الإلكتروني" }),
	).toBeVisible();
	await page.getByLabel("Viewport").selectOption("compact");
	await expect(page.locator("[data-input-preview]")).toHaveCSS(
		"max-width",
		"320px",
	);
	await page.getByLabel("Consumer Theme").selectOption("night");
	await expect(page.locator("[data-input-preview]")).toHaveAttribute(
		"data-consumer-theme",
		"night",
	);

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Input preserves keyboard, readonly, disabled, and reduced motion behavior", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/components/input");

	const input = page.getByRole("textbox", { name: "Email address" });
	await input.focus();
	await expect(input).toHaveCSS("transition-property", "none");
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Read only").check();
	await expect(input).toHaveAttribute("readonly", "");
	await page.getByLabel("Disabled").check();
	await expect(input).toBeDisabled();
});

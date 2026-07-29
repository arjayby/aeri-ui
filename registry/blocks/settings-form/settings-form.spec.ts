import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Builder can retrieve and open the Settings Form Block", async ({
	page,
	request,
}) => {
	const response = await request.get("/r/settings-form.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "settings-form",
		type: "registry:block",
		files: [
			{
				target: "components/aeri/settings-form.tsx",
			},
		],
	});

	await page.goto("/blocks/settings-form");
	await expect(
		page.getByRole("heading", { exact: true, name: "Settings Form" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();
});

test("Builder can edit, validate, save, and recover from a failed settings submission", async ({
	page,
}) => {
	await page.goto("/blocks/settings-form");
	const email = page.getByRole("textbox", { name: "Email address" });

	await expect(email).toHaveValue("ada@example.com");
	await page.getByRole("button", { name: "Save settings" }).click();
	await expect(
		page.getByText("No changes to save.", { exact: true }),
	).toBeVisible();

	await email.fill("invalid-address");
	await page.getByRole("button", { name: "Save settings" }).click();
	await expect(
		page.getByText("Enter a valid email address.", { exact: true }),
	).toBeVisible();
	await expect(email).toBeFocused();

	await email.fill("ada+updates@example.com");
	await page.getByRole("switch", { name: "Product updates" }).press("Space");
	await page.getByRole("button", { name: "Save settings" }).click();
	await expect(
		page.getByRole("button", { name: "Saving settings" }),
	).toBeDisabled();
	await expect(page.getByRole("status")).toContainText("Settings saved.");

	await email.fill("ada+observer@example.com");
	await page.getByRole("button", { name: "Save settings" }).click();
	await expect(page.getByRole("status")).toContainText("Settings saved.");

	await email.fill("ada+failure@example.com");
	await page.getByRole("button", { name: "Save settings" }).click();
	await expect(
		page.getByText("We could not save your settings. Try again.", {
			exact: true,
		}),
	).toBeVisible();
});

test("Builder can use the Settings Form accessibly with reduced motion, RTL, and localized copy", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/blocks/settings-form");
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Consumer Theme").selectOption("night");
	await page.getByLabel("Text direction").selectOption("rtl");
	await page.getByLabel("Viewport").selectOption("compact");
	await page.getByLabel("Content language").selectOption("arabic");

	const preview = page.locator("[data-settings-form-preview]");
	await expect(preview).toHaveAttribute("data-consumer-theme", "night");
	await expect(preview).toHaveAttribute("dir", "rtl");
	await expect(preview).toHaveCSS("max-width", "320px");
	const email = page.getByRole("textbox", { name: "عنوان البريد الإلكتروني" });
	await email.fill("not-an-email");
	await page.getByRole("button", { name: "حفظ الإعدادات" }).click();
	await expect(
		page.getByText("أدخل عنوان بريد إلكتروني صالحاً.", { exact: true }),
	).toBeVisible();
	await expect(email).toBeFocused();
	await expect(email).toHaveCSS("transition-property", "none");
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

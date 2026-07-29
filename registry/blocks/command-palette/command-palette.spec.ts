import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Builder can search grouped commands and receive a selection callback", async ({
	page,
	request,
}) => {
	const response = await request.get("/r/command-palette.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "command-palette",
		type: "registry:block",
		files: [
			{
				target: "components/aeri/command-palette.tsx",
			},
		],
	});

	await page.goto("/blocks/command-palette");
	const openButton = page.getByRole("button", { name: "Open command palette" });
	await openButton.click();
	const dialog = page.getByRole("dialog", { name: "Open command palette" });

	const search = page.getByRole("combobox", { name: "Search commands" });
	await expect(search).toBeFocused();
	await expect(dialog.getByRole("status")).toHaveText("5 commands available.");
	await expect(page.getByRole("group", { name: "Navigation" })).toBeVisible();
	await page.keyboard.press("ArrowDown");
	await expect(search).toHaveAttribute("aria-activedescendant", /-option-/);
	await expect(
		page.getByRole("option", { name: "Open projects" }),
	).toHaveAttribute("aria-selected", "true");
	await page.keyboard.press("Enter");
	await expect(page.getByRole("status")).toHaveText("Opened projects");
	await expect(openButton).toBeFocused();

	await openButton.click();
	await search.fill("reports");
	await expect(
		page.getByRole("option", { name: "Open reports" }),
	).toBeVisible();
	await page.getByRole("option", { name: "Open reports" }).click();
	await expect(page.getByRole("status")).toHaveText("Opened reports");

	await openButton.click();
	await search.fill("no matching command");
	await expect(
		dialog.locator("p:not(.sr-only)").filter({ hasText: "No commands found." }),
	).toBeVisible();
	await expect(dialog.getByRole("status")).toHaveText("No commands found.");
	await page.keyboard.press("Escape");
	await expect(openButton).toBeFocused();

	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Consumer Theme").selectOption("night");
	await page.getByLabel("Text direction").selectOption("rtl");
	await page.getByLabel("Viewport").selectOption("compact");
	await page.getByLabel("Content language").selectOption("arabic");
	await expect(page.locator("[data-command-palette-preview]")).toHaveAttribute(
		"data-consumer-theme",
		"night",
	);
	await expect(page.locator("[data-command-palette-preview]")).toHaveAttribute(
		"dir",
		"rtl",
	);
	await expect(page.locator("[data-command-palette-preview]")).toHaveCSS(
		"max-width",
		"320px",
	);
	await expect(
		page.getByRole("button", { name: "فتح لوحة الأوامر" }),
	).toBeVisible();

	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Command Palette traps focus and preserves reduced motion", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/blocks/command-palette");
	await page.getByRole("button", { name: "Open command palette" }).click();

	const dialog = page.getByRole("dialog", { name: "Open command palette" });
	const search = page.getByRole("combobox", { name: "Search commands" });
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveCSS("transition-property", "none");
	await expect(search).toBeFocused();
	await page.keyboard.press("Shift+Tab");
	await expect(
		page.getByRole("button", { name: "Close command palette" }),
	).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(search).toBeFocused();
});

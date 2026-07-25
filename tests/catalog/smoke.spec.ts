import { expect, test } from "@playwright/test";

test("Builder can open the Catalog", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle("Aeri UI Catalog");
	await expect(
		page.getByRole("heading", { name: "Aeri UI Catalog" }),
	).toBeVisible();
	await expect(
		page.getByText("Installable interface source for React applications."),
	).toBeVisible();
});

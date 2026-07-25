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

test("Builder can read documentation within the Catalog shell", async ({
	page,
}) => {
	await page.goto("/docs");

	await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Documentation" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Hello World" }),
	).toBeVisible();
	await expect(page.getByText("Your first document")).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Learn more about Fumadocs" }),
	).toHaveAttribute("href", "https://fumadocs.dev");
});

test("Builder can read code examples in documentation", async ({ page }) => {
	await page.goto("/docs/test");

	await expect(page).toHaveTitle("Components");
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
	await expect(page.locator("pre")).toContainText(
		'console.log("Hello World");',
	);
});

test("Builder receives guidance for a missing Catalog document", async ({
	page,
}) => {
	await page.goto("/docs/missing-page");

	await expect(
		page.getByRole("heading", { name: "This page could not be found." }),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Browse documentation" }),
	).toHaveAttribute("href", "/docs");
});

test("Builder can search the embedded documentation", async ({ request }) => {
	const response = await request.get("/api/search?query=Hello");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ type: "page", url: "/docs" }),
		]),
	);
});

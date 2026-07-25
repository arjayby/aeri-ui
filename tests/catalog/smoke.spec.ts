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

test("Builder can find the project trust guidance in the Catalog", async ({
	page,
}) => {
	for (const [path, heading] of [
		["contributing", "Contributing to Aeri UI"],
		["governance", "Aeri UI Governance"],
		["security", "Security Policy"],
		["privacy", "Privacy Notice"],
	]) {
		await page.goto(`/docs/${path}`);
		await expect(page.getByRole("heading", { name: heading })).toBeVisible();
	}
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

test("Builder can search documentation and navigate to a result", async ({
	page,
}) => {
	await page.goto("/docs");

	await page.getByRole("button", { name: "Search" }).click();
	await page.getByPlaceholder("Search").fill("Hello");
	await page.getByRole("button", { name: "Hello World" }).click();

	await expect(page).toHaveURL(/\/docs$/);
	await expect(
		page.getByRole("heading", { name: "Hello World" }),
	).toBeVisible();
});

test("Builder receives an empty state for documentation searches", async ({
	page,
}) => {
	await page.goto("/docs");

	await page.getByRole("button", { name: "Search" }).click();
	await page.getByPlaceholder("Search").fill("xqzv-absent-catalog-page");

	await expect(page.getByText("No results found")).toBeVisible();
});

test("Builder can query the local documentation index", async ({ request }) => {
	const response = await request.get("/api/search?query=Hello");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ type: "page", url: "/docs" }),
		]),
	);
});

test("Builder can access machine readable documentation", async ({
	request,
}) => {
	const [
		index,
		full,
		rootDocument,
		componentDocument,
		markdownPreferred,
		markdownSuffix,
		image,
	] = await Promise.all([
		request.get("/llms.txt"),
		request.get("/llms-full.txt"),
		request.get("/llms.mdx/docs/content.md"),
		request.get("/llms.mdx/docs/test/content.md"),
		request.get("/docs/test", {
			headers: { Accept: "text/markdown" },
		}),
		request.get("/docs/test.md"),
		request.get("/og/docs/image.png"),
	]);

	for (const response of [
		index,
		full,
		rootDocument,
		componentDocument,
		markdownPreferred,
		markdownSuffix,
		image,
	]) {
		expect(response.ok()).toBeTruthy();
	}

	expect(await index.text()).toContain("Hello World");
	expect(await full.text()).toContain("# Components (/docs/test)");
	expect(await rootDocument.text()).toContain("# Hello World (/docs)");
	expect(await componentDocument.text()).toContain("# Components (/docs/test)");
	expect(await markdownPreferred.text()).toContain("# Components (/docs/test)");
	expect(await markdownSuffix.text()).toContain("# Components (/docs/test)");
	expect(image.headers()["content-type"]).toContain("image/png");
});

test("Catalog documentation has a canonical public address", async ({
	page,
}) => {
	await page.goto("/docs");

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://aeriui.dev/docs",
	);
});

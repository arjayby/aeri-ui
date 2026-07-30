import { expect, test, type APIResponse } from "@playwright/test";

async function expectSearchResult(response: APIResponse, url: string) {
	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				type: "page",
				url,
			}),
		]),
	);
}

test("Builder can open the Aeri UI landing page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle("Aeri UI");
	await expect(
		page.getByRole("heading", {
			name: "Polished interactions, ready to make yours.",
		}),
	).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: "Main" }).getByRole("link", {
			name: "Docs",
		}),
	).toHaveAttribute("href", "/docs");
	await expect(
		page
			.getByRole("navigation", { name: "Main" })
			.getByRole("link", { name: "Components", exact: true }),
	).toHaveAttribute("href", "/components");
	await expect(
		page
			.getByRole("navigation", { name: "Main" })
			.getByRole("link", { name: "Blocks", exact: true }),
	).toHaveAttribute("href", "/blocks");
});

test("Builder can read the documentation introduction", async ({ page }) => {
	await page.goto("/docs");

	await expect(
		page.getByRole("heading", { name: "Introduction", exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "How the registry works" }),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Browse All", exact: true }).first(),
	).toHaveAttribute("href", "/components");
	await expect(
		page.getByRole("complementary").getByRole("link", { name: "Button" }),
	).toHaveAttribute("href", "/components/button");
});

test("Builder can browse the component catalog", async ({ page }) => {
	await page.goto("/components");

	await expect(
		page.getByRole("heading", { name: "Components", exact: true }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "Actions" })).toBeVisible();
	await expect(page.getByRole("link", { name: "View Button" })).toHaveAttribute(
		"href",
		"/components/button",
	);
	const buttonCard = page.getByRole("article").filter({ hasText: "Button" });
	await expect(buttonCard.getByText("Preview", { exact: true })).toBeVisible();
	await expect(buttonCard.getByText("New", { exact: true })).toBeVisible();

	await page.getByRole("button", { name: "Client boundary" }).click();
	await expect(page.getByRole("link", { name: "View Button" })).toBeVisible();
	await page.getByRole("button", { name: "Uses Base UI" }).click();
	await expect(page.getByRole("link", { name: "View Button" })).toBeVisible();
	await page.getByRole("button", { name: "Native implementation" }).click();
	await expect(page.getByRole("link", { name: "View Button" })).toBeVisible();
	await page.getByRole("button", { name: "Recently published" }).click();
	await expect(page.getByRole("link", { name: "View Button" })).toBeVisible();
});

test("Builder can inspect and install Button", async ({ page }) => {
	await page.goto("/components/button");

	await expect(
		page.getByRole("heading", { name: "Button", exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();
	await expect(
		page.getByRole("tab", { exact: true, name: "npm" }),
	).toHaveAttribute("aria-selected", "true");
	await expect(
		page.locator("pre").filter({ hasText: "ButtonPrimitive" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "API reference" }),
	).toBeVisible();
});

test("Builder can browse the Block catalog", async ({ page }) => {
	await page.goto("/blocks");

	await expect(
		page.getByRole("heading", { name: "Blocks", exact: true }),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Actions" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Command Palette" }),
	).toHaveCount(2);
	await expect(
		page.getByRole("link", { name: "View Command Palette" }).first(),
	).toHaveAttribute("href", "/blocks/command-palette");
});

test("Builder can read every migrated document in the unified Catalog", async ({
	page,
	request,
}) => {
	const documents = [
		["/docs/contributing", "Contributing to Aeri UI"],
		["/docs/governance", "Aeri UI Governance"],
		["/docs/privacy", "Privacy Notice"],
		["/docs/security", "Security Policy"],
		["/docs/test", "Components"],
	] as const;

	for (const [path, title] of documents) {
		await page.goto(path);
		await expect(
			page.getByRole("heading", { name: title, exact: true }),
		).toBeVisible();
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`https://aeriui.dev${path}`,
		);

		const markdownResponse = await request.get(`${path}.md`);
		expect(markdownResponse.ok()).toBeTruthy();
		expect(await markdownResponse.text()).toContain(`# ${title} (${path})`);
	}

	const missingResponse = await request.get("/docs/no-longer-published");
	expect(missingResponse.status()).toBe(404);
});

test("Builder can evaluate the 1.0 release candidate without mistaking it for a stable release", async ({
	page,
}) => {
	await page.goto("/docs/release-candidate");

	await expect(
		page.getByRole("heading", {
			name: "Aeri UI 1.0 release candidate",
			exact: true,
		}),
	).toBeVisible();
	await expect(
		page.getByText("This is not a stable 1.0 release.", { exact: true }),
	).toBeVisible();
	await expect(
		page.getByText('"@aeri-ui": "https://aeriui.dev/r/{name}.json"', {
			exact: true,
		}),
	).toBeVisible();
	await expect(
		page.getByText("npx shadcn@latest add https://aeriui.dev/r/button.json", {
			exact: true,
		}),
	).toBeVisible();

	for (const heading of [
		"Source ownership",
		"Support boundary",
		"Update behavior",
		"Privacy",
		"Migration guarantees",
	]) {
		await expect(page.getByRole("heading", { name: heading })).toBeVisible();
	}
});

test("Builder sees the audited Preview Item contract on every Launch Set Item Page", async ({
	page,
	request,
}) => {
	const registryResponse = await request.get("/r/registry.json");
	expect(registryResponse.ok()).toBeTruthy();
	const registry = (await registryResponse.json()) as {
		items: Array<{ categories: string[]; name: string; title: string }>;
	};
	expect(registry.items).toHaveLength(11);

	for (const { categories, name, title } of registry.items) {
		const collection = categories.includes("block") ? "blocks" : "components";
		await page.goto(`/${collection}/${name}`);

		await expect(
			page.getByRole("heading", { name: title, exact: true }),
		).toBeVisible();
		await expect(page.getByText("Preview", { exact: true })).toBeVisible();
		await expect(
			page.getByText(
				"Preview installation requires registry configuration until directory acceptance.",
				{ exact: true },
			),
		).toBeVisible();

		for (const [packageManager, command] of [
			["npm", `npx shadcn@latest add @aeri-ui/${name}`],
			["pnpm", `pnpm dlx shadcn@latest add @aeri-ui/${name}`],
			["yarn", `yarn dlx shadcn@latest add @aeri-ui/${name}`],
			["bun", `bunx --bun shadcn@latest add @aeri-ui/${name}`],
		] as const) {
			await page
				.getByRole("tab", { name: packageManager, exact: true })
				.click();
			await expect(page.getByText(command, { exact: true })).toBeVisible();
		}

		await expect(
			page.getByRole("link", { name: "View on GitHub" }),
		).toHaveAttribute(
			"href",
			`https://github.com/arjayby/aeri-ui/tree/main/registry/${collection}/${name}/${name}.tsx`,
		);
		await expect(
			page.getByRole("heading", { name: "Changelog" }),
		).toBeVisible();
	}
});

test("Builder can search every current public destination", async ({
	page,
}) => {
	await page.goto("/docs");

	await page.getByRole("button", { name: "Search" }).click();
	await page.getByPlaceholder("Search").fill("Button");
	await page.getByRole("button", { name: "Button" }).click();

	await expect(page).toHaveURL(/\/components\/button$/);
});

test("Builder receives an empty state for searches", async ({ page }) => {
	await page.goto("/docs");

	await page.getByRole("button", { name: "Search" }).click();
	await page.getByPlaceholder("Search").fill("xqzv");

	await expect(page.getByText("No results found")).toBeVisible();
});

test("Builder can query the unified search index", async ({ request }) => {
	const [
		buttonResponse,
		privacyResponse,
		introductionResponse,
		introductionMarkdown,
	] = await Promise.all([
		request.get("/api/search?query=Button"),
		request.get("/api/search?query=Privacy"),
		request.get("/api/search?query=Introduction"),
		request.get("/llms.mdx/docs/content.md"),
	]);

	await expectSearchResult(buttonResponse, "/components/button");
	await expectSearchResult(privacyResponse, "/docs/privacy");
	await expectSearchResult(introductionResponse, "/docs");
	expect(await introductionMarkdown.text()).toContain(
		"The complete Launch Set contains eight Components and three Blocks.",
	);
});

test("Builder can access the machine readable introduction", async ({
	request,
}) => {
	const [index, full, rootDocument, markdownPreferred, image] =
		await Promise.all([
			request.get("/llms.txt"),
			request.get("/llms-full.txt"),
			request.get("/llms.mdx/docs/content.md"),
			request.get("/docs", {
				headers: { Accept: "text/markdown" },
			}),
			request.get("/og/docs/image.png"),
		]);

	for (const response of [
		index,
		full,
		rootDocument,
		markdownPreferred,
		image,
	]) {
		expect(response.ok()).toBeTruthy();
	}

	expect(await index.text()).toContain("Introduction");
	expect(await full.text()).toContain("# Introduction (/docs)");
	expect(await rootDocument.text()).toContain("# Introduction (/docs)");
	expect(await markdownPreferred.text()).toContain("# Introduction (/docs)");
	expect(image.headers()["content-type"]).toContain("image/png");
});

test("Documentation has a canonical public address", async ({ page }) => {
	await page.goto("/docs");

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://aeriui.dev/docs",
	);
});

test("Builder sees a migrated document in the production Catalog", async ({
	page,
}) => {
	await page.goto("/docs/security");

	await expect(page).toHaveScreenshot("documentation-security.png", {
		fullPage: true,
		maxDiffPixels: 4_000,
	});
});

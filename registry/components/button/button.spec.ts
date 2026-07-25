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
}) => {
	await page.goto("/items/button");

	await expect(
		page.getByRole("heading", { exact: true, name: "Button" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Save changes" }),
	).toBeVisible();
	await expect(
		page.getByText("npx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await expect(
		page.getByText("pnpm dlx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await expect(
		page.getByText("yarn dlx shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await expect(
		page.getByText("bunx --bun shadcn@latest add @aeri-ui/button"),
	).toBeVisible();
	await expect(page.getByLabel("Consumer Theme")).toBeVisible();
	await expect(page.getByLabel("Disabled")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Copy npm command" }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible();

	await page.getByRole("button", { name: "Save changes" }).click();

	await expect(page.getByRole("status")).toHaveText("Action acknowledged");
});

import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Builder can retrieve and open the File Upload Block", async ({
	page,
	request,
}) => {
	const response = await request.get("/r/file-upload.json");

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toMatchObject({
		name: "file-upload",
		type: "registry:block",
		files: [
			{
				target: "components/aeri/file-upload.tsx",
			},
		],
	});

	await page.goto("/blocks/file-upload");
	await expect(
		page.getByRole("heading", { exact: true, name: "File Upload" }),
	).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Live preview" }),
	).toBeVisible();
});

test("Builder can select accepted files and understand validation feedback", async ({
	page,
}) => {
	await page.goto("/blocks/file-upload");
	const picker = page.getByLabel("Upload documents");

	await picker.setInputFiles({
		name: "notes.txt",
		mimeType: "text/plain",
		buffer: Buffer.from("not an image"),
	});
	await expect(
		page.getByText("Choose PNG or JPEG files.", { exact: true }),
	).toBeVisible();

	await picker.setInputFiles({
		name: "receipt.png",
		mimeType: "image/png",
		buffer: Buffer.from("image"),
	});
	await expect(
		page.getByRole("list", { name: "Selected files" }),
	).toContainText("receipt.png");
	await expect(page.getByText("Uploading", { exact: true })).toBeVisible();
	await expect(
		page.locator('[data-slot="aeri-file-upload"]').getByRole("status"),
	).toContainText("receipt.png: Uploading");

	await picker.setInputFiles({
		name: "large.png",
		mimeType: "image/png",
		buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
	});
	await expect(
		page.getByText("Choose a file smaller than 5 MB.", { exact: true }),
	).toBeVisible();
	await page.getByRole("group", { name: "File drop zone" }).evaluate((zone) => {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(
			new File(["image"], "dropped.png", { type: "image/png" }),
		);
		zone.dispatchEvent(new DragEvent("drop", { bubbles: true, dataTransfer }));
	});
	await expect(
		page.getByRole("list", { name: "Selected files" }),
	).toContainText("dropped.png");

	await picker.setInputFiles([
		{
			name: "two.png",
			mimeType: "image/png",
			buffer: Buffer.from("image"),
		},
		{
			name: "three.png",
			mimeType: "image/png",
			buffer: Buffer.from("image"),
		},
		{
			name: "four.png",
			mimeType: "image/png",
			buffer: Buffer.from("image"),
		},
	]);
	await expect(
		page.getByText("Choose up to 3 files.", { exact: true }),
	).toBeVisible();
});

test("Builder can demonstrate progress, failure, retry, cancellation, and success", async ({
	page,
}) => {
	await page.goto("/blocks/file-upload");
	const picker = page.getByLabel("Upload documents");

	await picker.setInputFiles({
		name: "receipt.png",
		mimeType: "image/png",
		buffer: Buffer.from("image"),
	});
	const receipt = page.getByRole("listitem").filter({ hasText: "receipt.png" });
	const advanceUploads = page.getByRole("button", { name: "Advance uploads" });
	await advanceUploads.click();
	await expect(
		receipt.getByRole("progressbar", { name: "receipt.png upload progress" }),
	).toHaveAttribute("value", "25");
	await advanceUploads.click();
	await advanceUploads.click();
	await advanceUploads.click();
	await expect(receipt.getByText("Uploaded", { exact: true })).toBeVisible();

	await picker.setInputFiles({
		name: "broken.png",
		mimeType: "image/png",
		buffer: Buffer.from("image"),
	});
	const broken = page.getByRole("listitem").filter({ hasText: "broken.png" });
	await page.getByRole("button", { name: "Fail uploads" }).click();
	await expect(
		broken.getByText("Upload failed.", { exact: true }),
	).toBeVisible();
	await broken.getByRole("button", { name: "Retry" }).click();
	await expect(broken.getByText("Uploading", { exact: true })).toBeVisible();
	await broken.getByRole("button", { name: "Cancel" }).click();
	await expect(broken.getByText("Cancelled", { exact: true })).toBeVisible();
});

test("Builder can use File Upload accessibly with reduced motion, RTL, and localized copy", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/blocks/file-upload");
	await page.getByText("Controls", { exact: true }).click();
	await page.getByLabel("Consumer Theme").selectOption("night");
	await page.getByLabel("Text direction").selectOption("rtl");
	await page.getByLabel("Viewport").selectOption("compact");
	await page.getByLabel("Content language").selectOption("arabic");

	const preview = page.locator("[data-file-upload-preview]");
	await expect(preview).toHaveAttribute("data-consumer-theme", "night");
	await expect(preview).toHaveAttribute("dir", "rtl");
	await expect(preview).toHaveCSS("max-width", "320px");
	await expect(
		page.getByRole("group", { name: "منطقة إفلات الملفات" }),
	).toBeVisible();
	const picker = page.getByRole("button", { name: "اختيار الملفات" });
	await picker.focus();
	await expect(picker).toHaveCSS("transition-property", "none");
	await page.getByLabel("رفع المستندات").setInputFiles({
		name: "very-long-receipt-file-name-that-must-wrap-on-a-compact-viewport.png",
		mimeType: "image/png",
		buffer: Buffer.from("image"),
	});
	const uploadedFile = page
		.getByRole("list", { name: "الملفات المحددة" })
		.getByRole("listitem");
	await expect(
		uploadedFile.getByRole("progressbar", {
			name: "تقدم رفع very-long-receipt-file-name-that-must-wrap-on-a-compact-viewport.png",
		}),
	).toBeVisible();
	await expect(
		preview.locator('[data-slot="aeri-file-upload"]').getByRole("status"),
	).toContainText(
		"حالة very-long-receipt-file-name-that-must-wrap-on-a-compact-viewport.png: جارٍ الرفع",
	);
	expect(
		await uploadedFile.evaluate(
			(element) => element.scrollWidth <= element.clientWidth,
		),
	).toBe(true);
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

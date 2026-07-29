"use client";

import { type CSSProperties, useState } from "react";

import {
	FileUpload,
	type FileUploadFile,
	type FileUploadLabels,
} from "./file-upload";

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ContentLanguage = "arabic" | "english";
type TextDirection = "ltr" | "rtl";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
		"--muted": "oklch(0.25 0.02 260)",
		"--muted-foreground": "oklch(0.74 0.02 260)",
		"--primary": "oklch(0.8 0.1 235)",
		"--primary-foreground": "oklch(0.2 0.02 235)",
	},
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--primary-foreground": "oklch(0.98 0.01 235)",
	},
};

const localizedContent: Record<
	ContentLanguage,
	{
		advance: string;
		description: string;
		fail: string;
		invalidFileType: string;
		label: string;
		labels: FileUploadLabels;
		maxFileSize: string;
		maxFiles: string;
	}
> = {
	arabic: {
		advance: "تقديم عمليات الرفع",
		description: "نقبل ملفات PNG أو JPEG.",
		fail: "محاكاة فشل الرفع",
		invalidFileType: "اختر ملفات PNG أو JPEG.",
		label: "رفع المستندات",
		labels: {
			browse: "اختيار الملفات",
			cancel: "إلغاء",
			cancelled: "تم الإلغاء",
			dropZone: "منطقة إفلات الملفات",
			dropFiles: "أفلت الملفات هنا",
			or: "أو",
			remove: "إزالة",
			retry: "إعادة المحاولة",
			selectedFiles: "الملفات المحددة",
			statusAnnouncement: (fileName, status) => `حالة ${fileName}: ${status}`,
			success: "تم الرفع",
			uploadError: "فشل الرفع.",
			uploadProgress: (fileName) => `تقدم رفع ${fileName}`,
			uploading: "جارٍ الرفع",
		},
		maxFileSize: "اختر ملفاً أصغر من 5 ميغابايت.",
		maxFiles: "اختر حتى 3 ملفات.",
	},
	english: {
		advance: "Advance uploads",
		description: "PNG or JPEG files are accepted.",
		fail: "Fail uploads",
		invalidFileType: "Choose PNG or JPEG files.",
		label: "Upload documents",
		labels: {
			browse: "Choose files",
			cancel: "Cancel",
			cancelled: "Cancelled",
			dropZone: "File drop zone",
			dropFiles: "Drop files here",
			or: "or",
			remove: "Remove",
			retry: "Retry",
			selectedFiles: "Selected files",
			statusAnnouncement: (fileName, status) => `${fileName}: ${status}`,
			success: "Uploaded",
			uploadError: "Upload failed.",
			uploadProgress: (fileName) => `${fileName} upload progress`,
			uploading: "Uploading",
		},
		maxFileSize: "Choose a file smaller than 5 MB.",
		maxFiles: "Choose up to 3 files.",
	},
};

export function FileUploadPreview() {
	const [contentLanguage, setContentLanguage] =
		useState<ContentLanguage>("english");
	const [files, setFiles] = useState<FileUploadFile[]>([]);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [viewport, setViewport] = useState<Viewport>("default");
	const content = localizedContent[contentLanguage];
	const hasUploadingFiles = files.some((file) => file.status === "uploading");

	function updateFile(
		id: string,
		update: (file: FileUploadFile) => FileUploadFile,
	) {
		setFiles((currentFiles) =>
			currentFiles.map((file) => (file.id === id ? update(file) : file)),
		);
	}

	function advanceUploads() {
		setFiles((currentFiles) =>
			currentFiles.map((file) => {
				if (file.status !== "uploading") {
					return file;
				}

				const progress = Math.min((file.progress ?? 0) + 25, 100);
				return {
					...file,
					progress,
					status: progress === 100 ? "success" : "uploading",
				};
			}),
		);
	}

	function failUploads() {
		setFiles((currentFiles) =>
			currentFiles.map((file) =>
				file.status === "uploading"
					? {
							...file,
							error: content.labels.uploadError,
							status: "error",
						}
					: file,
			),
		);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<details className="rounded-xl border border-border/70 bg-background/70">
				<summary className="cursor-pointer list-none px-4 py-3 font-medium text-sm">
					Controls
				</summary>
				<fieldset className="flex flex-wrap gap-4 border-border/70 border-t px-4 py-4 text-sm">
					<label>
						Consumer Theme
						<select
							aria-label="Consumer Theme"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setTheme(event.target.value as ConsumerTheme)
							}
							value={theme}
						>
							<option value="neutral">Neutral</option>
							<option value="ocean">Ocean</option>
							<option value="night">Night</option>
						</select>
					</label>
					<label>
						Content language
						<select
							aria-label="Content language"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setContentLanguage(event.target.value as ContentLanguage)
							}
							value={contentLanguage}
						>
							<option value="english">English</option>
							<option value="arabic">Arabic</option>
						</select>
					</label>
					<label>
						Viewport
						<select
							aria-label="Viewport"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) => setViewport(event.target.value as Viewport)}
							value={viewport}
						>
							<option value="default">Default</option>
							<option value="compact">Compact</option>
						</select>
					</label>
					<label>
						Text direction
						<select
							aria-label="Text direction"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setTextDirection(event.target.value as TextDirection)
							}
							value={textDirection}
						>
							<option value="ltr">Left to right</option>
							<option value="rtl">Right to left</option>
						</select>
					</label>
					<label className="flex items-center gap-2">
						<input
							checked={reducedMotion}
							onChange={(event) => setReducedMotion(event.target.checked)}
							type="checkbox"
						/>
						Reduced motion
					</label>
				</fieldset>
			</details>
			<div
				className={reducedMotion ? "[&_*]:!transition-none" : undefined}
				data-consumer-theme={theme}
				data-file-upload-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<fieldset className="flex flex-wrap gap-2" aria-label="Upload controls">
					<button
						className="rounded-lg border border-border px-3 py-2 font-medium text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!hasUploadingFiles}
						onClick={advanceUploads}
						type="button"
					>
						{content.advance}
					</button>
					<button
						className="rounded-lg border border-border px-3 py-2 font-medium text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!hasUploadingFiles}
						onClick={failUploads}
						type="button"
					>
						{content.fail}
					</button>
				</fieldset>
				<FileUpload
					accept="image/png,image/jpeg"
					description={content.description}
					files={files}
					invalidFileTypeMessage={content.invalidFileType}
					label={content.label}
					labels={content.labels}
					maxFileSize={5 * 1024 * 1024}
					maxFileSizeMessage={content.maxFileSize}
					maxFiles={3}
					maxFilesMessage={content.maxFiles}
					onFileCancel={(file) =>
						updateFile(file.id, (currentFile) => ({
							...currentFile,
							status: "cancelled",
						}))
					}
					onFileRemove={(file) =>
						setFiles((currentFiles) =>
							currentFiles.filter((currentFile) => currentFile.id !== file.id),
						)
					}
					onFileRetry={(file) =>
						updateFile(file.id, (currentFile) => ({
							...currentFile,
							error: undefined,
							progress: 0,
							status: "uploading",
						}))
					}
					onFilesSelected={(selectedFiles) =>
						setFiles((currentFiles) => [
							...currentFiles,
							...selectedFiles.map((file) => ({
								file,
								id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
								progress: 0,
								status: "uploading" as const,
							})),
						])
					}
				/>
			</div>
		</div>
	);
}

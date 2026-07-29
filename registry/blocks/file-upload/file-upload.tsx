"use client";

import * as React from "react";

type FileUploadFile = {
	error?: React.ReactNode;
	file: File;
	id: string;
	progress?: number;
	status: "cancelled" | "error" | "success" | "uploading";
};

type FileUploadLabels = {
	browse: string;
	cancel: string;
	cancelled: string;
	dropZone: string;
	dropFiles: string;
	or: string;
	remove: string;
	retry: string;
	selectedFiles: string;
	statusAnnouncement: (fileName: string, status: string) => string;
	success: string;
	uploadError: string;
	uploadProgress: (fileName: string) => string;
	uploading: string;
};

type FileUploadProps = {
	accept?: string;
	description?: React.ReactNode;
	disabled?: boolean;
	files?: FileUploadFile[];
	invalidFileTypeMessage?: string;
	label?: React.ReactNode;
	labels?: Partial<FileUploadLabels>;
	maxFileSize?: number;
	maxFileSizeMessage?: string;
	maxFiles?: number;
	maxFilesMessage?: string;
	onFilesSelected?: (files: File[]) => void;
	onFileCancel?: (file: FileUploadFile) => void;
	onFileRemove?: (file: FileUploadFile) => void;
	onFileRetry?: (file: FileUploadFile) => void;
};

const defaultLabels: FileUploadLabels = {
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
};

function matchesAcceptedType(file: File, accept?: string) {
	if (!accept) {
		return true;
	}

	return accept.split(",").some((acceptedType) => {
		const type = acceptedType.trim().toLocaleLowerCase();
		const fileName = file.name.toLocaleLowerCase();
		const fileType = file.type.toLocaleLowerCase();

		return (
			type === fileType ||
			(type.endsWith("/*") && fileType.startsWith(type.slice(0, -1))) ||
			(type.startsWith(".") && fileName.endsWith(type))
		);
	});
}

function FileUpload({
	accept,
	description,
	disabled = false,
	files = [],
	invalidFileTypeMessage = "Choose an accepted file type.",
	label = "Upload files",
	labels,
	maxFileSize,
	maxFileSizeMessage = "Choose a smaller file.",
	maxFiles,
	maxFilesMessage = "Choose fewer files.",
	onFilesSelected,
	onFileCancel,
	onFileRemove,
	onFileRetry,
}: FileUploadProps) {
	const inputId = React.useId();
	const descriptionId = `${inputId}-description`;
	const errorId = `${inputId}-error`;
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
	const resolvedLabels = { ...defaultLabels, ...labels };

	function selectFiles(nextFiles: FileList | File[]) {
		const selectedFiles = Array.from(nextFiles);
		const errors: string[] = [];
		const acceptedFiles = selectedFiles.filter((file) => {
			if (!matchesAcceptedType(file, accept)) {
				errors.push(invalidFileTypeMessage);
				return false;
			}

			if (maxFileSize !== undefined && file.size > maxFileSize) {
				errors.push(maxFileSizeMessage);
				return false;
			}

			return true;
		});
		const availableSlots =
			maxFiles === undefined
				? Number.POSITIVE_INFINITY
				: Math.max(maxFiles - files.length, 0);
		const filesToSelect = acceptedFiles.slice(0, availableSlots);
		if (filesToSelect.length < acceptedFiles.length) {
			errors.push(maxFilesMessage);
		}

		setValidationErrors([...new Set(errors)]);
		if (filesToSelect.length > 0) {
			onFilesSelected?.(filesToSelect);
		}
	}
	const describedBy = [
		description ? descriptionId : undefined,
		validationErrors.length > 0 ? errorId : undefined,
	]
		.filter(Boolean)
		.join(" ");

	function getStatusLabel(item: FileUploadFile) {
		switch (item.status) {
			case "cancelled":
				return resolvedLabels.cancelled;
			case "error":
				return item.error ?? resolvedLabels.uploadError;
			case "success":
				return resolvedLabels.success;
			case "uploading":
				return resolvedLabels.uploading;
		}
	}

	function getStatusAnnouncement(item: FileUploadFile) {
		const status =
			item.status === "error" && typeof item.error === "string"
				? item.error
				: getStatusLabel(item);

		return resolvedLabels.statusAnnouncement(item.file.name, String(status));
	}

	return (
		<div className="grid gap-3" data-slot="aeri-file-upload">
			<div className="grid gap-1">
				<label className="font-medium text-sm" htmlFor={inputId}>
					{label}
				</label>
				{description ? (
					<p className="text-muted-foreground text-sm" id={descriptionId}>
						{description}
					</p>
				) : null}
			</div>
			<fieldset
				aria-describedby={describedBy || undefined}
				aria-invalid={validationErrors.length > 0 || undefined}
				aria-label={resolvedLabels.dropZone}
				className={`flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-colors motion-reduce:transition-none ${
					isDragging ? "border-primary bg-muted" : "border-border bg-background"
				}`}
				onDragEnter={(event) => {
					event.preventDefault();
					if (!disabled) {
						setIsDragging(true);
					}
				}}
				onDragLeave={(event) => {
					event.preventDefault();
					setIsDragging(false);
				}}
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault();
					setIsDragging(false);
					if (!disabled) {
						selectFiles(event.dataTransfer.files);
					}
				}}
			>
				<p className="font-medium text-sm">{resolvedLabels.dropFiles}</p>
				<p className="mt-1 text-muted-foreground text-sm">
					{resolvedLabels.or}
				</p>
				<button
					className="mt-3 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground text-sm outline-none transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
					disabled={disabled}
					onClick={() => inputRef.current?.click()}
					type="button"
				>
					{resolvedLabels.browse}
				</button>
				<input
					accept={accept}
					aria-describedby={describedBy || undefined}
					aria-errormessage={validationErrors.length > 0 ? errorId : undefined}
					aria-invalid={validationErrors.length > 0 || undefined}
					className="sr-only"
					disabled={disabled}
					id={inputId}
					multiple={maxFiles !== 1}
					onChange={(event) => {
						if (event.target.files) {
							selectFiles(event.target.files);
						}
						event.target.value = "";
					}}
					ref={inputRef}
					type="file"
				/>
			</fieldset>
			{validationErrors.length > 0 ? (
				<p className="text-destructive text-sm" id={errorId} role="alert">
					{validationErrors.join(" ")}
				</p>
			) : null}
			{files.length > 0 ? (
				<ul className="grid gap-2" aria-label={resolvedLabels.selectedFiles}>
					{files.map((item) => (
						<li
							className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm"
							key={item.id}
						>
							<span className="min-w-0 flex-1 break-words">
								{item.file.name}
							</span>
							<div className="flex flex-wrap items-center gap-3">
								{item.status === "uploading" ? (
									<progress
										aria-label={resolvedLabels.uploadProgress(item.file.name)}
										className="h-2 w-20 accent-primary"
										max={100}
										value={item.progress ?? 0}
									/>
								) : null}
								<span
									className="text-muted-foreground"
									role={item.status === "error" ? "alert" : undefined}
								>
									{getStatusLabel(item)}
								</span>
								{item.status === "uploading" && onFileCancel ? (
									<button
										className="rounded-md px-2 py-1 font-medium text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
										onClick={() => onFileCancel(item)}
										type="button"
									>
										{resolvedLabels.cancel}
									</button>
								) : null}
								{(item.status === "cancelled" || item.status === "error") &&
								onFileRetry ? (
									<button
										className="rounded-md px-2 py-1 font-medium text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
										onClick={() => onFileRetry(item)}
										type="button"
									>
										{resolvedLabels.retry}
									</button>
								) : null}
								{onFileRemove ? (
									<button
										className="rounded-md px-2 py-1 font-medium text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
										onClick={() => onFileRemove(item)}
										type="button"
									>
										{resolvedLabels.remove}
									</button>
								) : null}
							</div>
						</li>
					))}
				</ul>
			) : null}
			<p aria-atomic="true" className="sr-only" role="status">
				{files.map(getStatusAnnouncement).join(". ")}
			</p>
		</div>
	);
}

export {
	FileUpload,
	type FileUploadFile,
	type FileUploadLabels,
	type FileUploadProps,
};

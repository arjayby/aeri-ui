"use client";

import dynamic from "next/dynamic";

const FileUploadPreview = dynamic(
	() =>
		import("../../../../registry/blocks/file-upload/preview").then(
			(module) => module.FileUploadPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading File Upload preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyFileUploadPreview() {
	return <FileUploadPreview />;
}

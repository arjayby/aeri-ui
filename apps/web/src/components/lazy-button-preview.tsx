"use client";

import dynamic from "next/dynamic";

const ButtonPreview = dynamic<{ label: string }>(
	() =>
		import("../../../../registry/components/button/preview").then(
			(module) => module.ButtonPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Button preview"
				className="min-h-48 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyButtonPreview({ label }: { label: string }) {
	return <ButtonPreview label={label} />;
}

"use client";

import dynamic from "next/dynamic";

const TextSwapPreview = dynamic(
	() =>
		import("../../../../registry/components/text-swap/preview").then(
			(module) => module.TextSwapPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Text Swap preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyTextSwapPreview() {
	return <TextSwapPreview />;
}

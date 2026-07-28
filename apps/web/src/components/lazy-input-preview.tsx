"use client";

import dynamic from "next/dynamic";

const InputPreview = dynamic(
	() =>
		import("../../../../registry/components/input/preview").then(
			(module) => module.InputPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Input preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyInputPreview() {
	return <InputPreview />;
}

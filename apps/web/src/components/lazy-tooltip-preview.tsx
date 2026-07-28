"use client";

import dynamic from "next/dynamic";

const TooltipPreview = dynamic(
	() =>
		import("../../../../registry/components/tooltip/preview").then(
			(module) => module.TooltipPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Tooltip preview"
				className="min-h-44 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyTooltipPreview() {
	return <TooltipPreview />;
}

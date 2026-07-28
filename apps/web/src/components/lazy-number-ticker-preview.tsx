"use client";

import dynamic from "next/dynamic";

const NumberTickerPreview = dynamic(
	() =>
		import("../../../../registry/components/number-ticker/preview").then(
			(module) => module.NumberTickerPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Number Ticker preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyNumberTickerPreview() {
	return <NumberTickerPreview />;
}

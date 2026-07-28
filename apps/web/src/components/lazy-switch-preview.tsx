"use client";

import dynamic from "next/dynamic";

const SwitchPreview = dynamic(
	() =>
		import("../../../../registry/components/switch/preview").then(
			(module) => module.SwitchPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Switch preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazySwitchPreview() {
	return <SwitchPreview />;
}

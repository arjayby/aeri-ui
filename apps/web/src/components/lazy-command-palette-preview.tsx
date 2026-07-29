"use client";

import dynamic from "next/dynamic";

const CommandPalettePreview = dynamic(
	() =>
		import("../../../../registry/blocks/command-palette/preview").then(
			(module) => module.CommandPalettePreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Command Palette preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyCommandPalettePreview() {
	return <CommandPalettePreview />;
}

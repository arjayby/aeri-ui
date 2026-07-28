"use client";

import dynamic from "next/dynamic";

const TabsPreview = dynamic(
	() =>
		import("../../../../registry/components/tabs/preview").then(
			(module) => module.TabsPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Tabs preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyTabsPreview() {
	return <TabsPreview />;
}

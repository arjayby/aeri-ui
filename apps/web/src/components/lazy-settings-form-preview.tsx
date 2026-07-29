"use client";

import dynamic from "next/dynamic";

const SettingsFormPreview = dynamic(
	() =>
		import("../../../../registry/blocks/settings-form/preview").then(
			(module) => module.SettingsFormPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Settings Form preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazySettingsFormPreview() {
	return <SettingsFormPreview />;
}

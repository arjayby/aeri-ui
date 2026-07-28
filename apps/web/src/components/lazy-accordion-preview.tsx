"use client";

import dynamic from "next/dynamic";

const AccordionPreview = dynamic(
	() =>
		import("../../../../registry/components/accordion/preview").then(
			(module) => module.AccordionPreview,
		),
	{
		loading: () => (
			<div
				aria-label="Loading Accordion preview"
				className="min-h-72 animate-pulse rounded-2xl bg-muted"
				role="status"
			/>
		),
		ssr: false,
	},
);

export function LazyAccordionPreview() {
	return <AccordionPreview />;
}

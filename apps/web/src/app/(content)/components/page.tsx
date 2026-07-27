import type { Metadata } from "next";

import { CatalogBrowser } from "@/components/catalog-browser";
import { ContentPageHeader } from "@/components/content-page-header";
import { getCatalogItems } from "@/lib/catalog";

export const metadata: Metadata = {
	title: "Components",
	description:
		"Polished interaction components you can install, own, and adapt.",
	alternates: {
		canonical: "/components",
	},
};

export default function ComponentsPage() {
	const items = getCatalogItems("component");

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-14 sm:py-20 lg:px-10">
			<ContentPageHeader
				description="Polished interaction components you can install, own, and adapt. The collection is intentionally small while every item earns its place."
				title="Components"
			/>
			<CatalogBrowser collection="component" items={items} />
		</main>
	);
}

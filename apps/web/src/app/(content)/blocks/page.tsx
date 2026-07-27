import type { Metadata } from "next";

import { CatalogBrowser } from "@/components/catalog-browser";
import { ContentPageHeader } from "@/components/content-page-header";
import { getCatalogItems } from "@/lib/catalog";

export const metadata: Metadata = {
	title: "Blocks",
	description:
		"Production ready interface sections composed from Aeri UI components.",
	alternates: {
		canonical: "/blocks",
	},
};

export default function BlocksPage() {
	const items = getCatalogItems("block");

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-14 sm:py-20 lg:px-10">
			<ContentPageHeader
				description="Production ready interface sections composed from Aeri UI components. The collection will grow after the component foundation is ready."
				title="Blocks"
			/>
			<CatalogBrowser collection="block" items={items} />
		</main>
	);
}

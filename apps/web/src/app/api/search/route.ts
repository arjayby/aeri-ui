import { createSearchAPI } from "fumadocs-core/search/server";

import { catalogItems, getCategoryLabel } from "@/lib/catalog";
import { getLLMText, source } from "@/lib/source";

export const { GET } = createSearchAPI("simple", {
	indexes: async () => [
		...(await Promise.all(
			source.getPages().map(async (page) => ({
				title: page.data.title,
				description: page.data.description,
				content: await getLLMText(page),
				url: page.url,
				breadcrumbs: ["Docs"],
			})),
		)),
		{
			title: "Components",
			description:
				"Polished interaction components you can install, own, and adapt.",
			content:
				"components catalog actions forms navigation overlays feedback data display content interaction source shadcn Next.js React",
			url: "/components",
			breadcrumbs: ["Components"],
		},
		{
			title: "Blocks",
			description:
				"Production ready interface sections composed from Aeri UI components.",
			content:
				"blocks catalog actions forms navigation overlays feedback data display content application patterns",
			url: "/blocks",
			breadcrumbs: ["Blocks"],
		},
		...catalogItems.map((item) => ({
			title: item.title,
			description: item.description,
			content: [
				item.collection,
				item.implementation,
				item.boundary,
				item.lifecycle,
				item.hasBaseUi ? "Base UI" : "",
				...item.categories.map(getCategoryLabel),
				item.searchContent,
			].join(" "),
			url: item.url,
			breadcrumbs: [
				item.collection === "component" ? "Components" : "Blocks",
				item.title,
			],
		})),
	],
	language: "english",
});

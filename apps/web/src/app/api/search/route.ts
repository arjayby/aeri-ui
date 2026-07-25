import { createSearchAPI } from "fumadocs-core/search/server";

import { button } from "@/lib/registry";
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
				"components catalog actions interaction source shadcn Next.js React",
			url: "/components",
			breadcrumbs: ["Components"],
		},
		{
			title: button.title,
			description: button.description,
			content: `${button.docs} ${button.meta.example}`,
			url: "/components/button",
			breadcrumbs: ["Components", "Button"],
		},
		{
			title: "Blocks",
			description:
				"Production ready interface sections composed from Aeri UI components.",
			content: "blocks catalog application patterns coming soon",
			url: "/blocks",
			breadcrumbs: ["Blocks"],
		},
	],
	language: "english",
});

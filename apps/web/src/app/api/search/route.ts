import { createSearchAPI } from "fumadocs-core/search/server";

import { button } from "@/lib/registry";

export const { GET } = createSearchAPI("simple", {
	indexes: [
		{
			title: "Introduction",
			description:
				"Learn what Aeri UI is, how its registry works, and what you own.",
			content:
				"Aeri UI registry source ownership supported stack current catalog getting started documentation",
			url: "/docs",
			breadcrumbs: ["Docs"],
		},
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

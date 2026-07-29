import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyTextSwapPreview } from "@/components/lazy-text-swap-preview";
import { textSwap, textSwapSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/components/text-swap",
	},
	description: textSwap.description,
	title: textSwap.title,
};

type ApiEntry = {
	description: string;
	property: string;
	type: string;
};

const api = textSwap.meta.api as ApiEntry[];

function TextSwapApi() {
	return (
		<table className="w-full min-w-xl text-left text-sm">
			<thead className="bg-muted/50 text-muted-foreground">
				<tr>
					<th className="px-5 py-3 font-medium">Property</th>
					<th className="px-5 py-3 font-medium">Type</th>
					<th className="px-5 py-3 font-medium">Description</th>
				</tr>
			</thead>
			<tbody>
				{api.map((entry) => (
					<tr className="border-border/70 border-t" key={entry.property}>
						<td className="px-5 py-4 font-mono">{entry.property}</td>
						<td className="px-5 py-4 font-mono text-muted-foreground">
							{entry.type}
						</td>
						<td className="px-5 py-4 text-muted-foreground">
							{entry.description}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default function TextSwapPage() {
	return (
		<CatalogItemPage
			api={<TextSwapApi />}
			collection="component"
			name="text-swap"
			preview={<LazyTextSwapPreview />}
			source={textSwapSource}
		/>
	);
}

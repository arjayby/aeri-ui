import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyAccordionPreview } from "@/components/lazy-accordion-preview";
import { accordion, accordionSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/components/accordion",
	},
	description: accordion.description,
	title: accordion.title,
};

function AccordionApi() {
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
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">multiple</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">boolean</td>
					<td className="px-5 py-4 text-muted-foreground">
						Allows several Items to remain expanded.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">value</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						string[]
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Controls the expanded Item values.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">defaultValue</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						string[]
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Sets the initial expanded Item values for uncontrolled state.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onValueChange</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(value: string[]) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Receives the next expanded Item values.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">disabled</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">boolean</td>
					<td className="px-5 py-4 text-muted-foreground">
						Disables one AccordionItem while preserving its semantics.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">...props</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						Base UI Accordion props
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Preserves the appropriate Root and part attributes.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function AccordionPage() {
	return (
		<CatalogItemPage
			api={<AccordionApi />}
			collection="component"
			name="accordion"
			preview={<LazyAccordionPreview />}
			source={accordionSource}
		/>
	);
}

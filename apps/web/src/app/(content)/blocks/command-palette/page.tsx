import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyCommandPalettePreview } from "@/components/lazy-command-palette-preview";
import { commandPalette, commandPaletteSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/blocks/command-palette",
	},
	description: commandPalette.description,
	title: commandPalette.title,
};

function CommandPaletteApi() {
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
					<td className="px-5 py-4 font-mono">commands</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						CommandPaletteGroup[]
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Groups the consumer owned commands available for local search.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">
						open, defaultOpen, onOpenChange
					</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						boolean, callback
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Controls or observes dialog visibility.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onSelect</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(command) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Receives a selected command after its optional command callback
						runs.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">
						dialogLabel, placeholder, emptyLabel, closeLabel, closeShortcutLabel
					</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">string</td>
					<td className="px-5 py-4 text-muted-foreground">
						Provides localized labels for the dialog, search, empty state, and
						close control.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function CommandPalettePage() {
	return (
		<CatalogItemPage
			api={<CommandPaletteApi />}
			collection="block"
			name="command-palette"
			preview={<LazyCommandPalettePreview />}
			source={commandPaletteSource}
		/>
	);
}

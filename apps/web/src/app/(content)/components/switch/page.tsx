import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazySwitchPreview } from "@/components/lazy-switch-preview";
import { switchItem, switchSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/components/switch",
	},
	description: switchItem.description,
	title: switchItem.title,
};

function SwitchApi() {
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
					<td className="px-5 py-4 font-mono">checked</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">boolean</td>
					<td className="px-5 py-4 text-muted-foreground">
						Controls the checked state.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">defaultChecked</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">boolean</td>
					<td className="px-5 py-4 text-muted-foreground">
						Sets the initial checked state for uncontrolled use.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onCheckedChange</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(checked: boolean) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Receives the next checked state.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">name, value, form</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">string</td>
					<td className="px-5 py-4 text-muted-foreground">
						Connects the hidden input to a form submission.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">disabled, readOnly, required</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">boolean</td>
					<td className="px-5 py-4 text-muted-foreground">
						Preserves disabled, readonly, and required behavior.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">...props</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						Base UI Switch props
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Preserves Root and Thumb attributes and forwarded refs.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function SwitchPage() {
	return (
		<CatalogItemPage
			api={<SwitchApi />}
			collection="component"
			name="switch"
			preview={<LazySwitchPreview />}
			source={switchSource}
		/>
	);
}

import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyInputPreview } from "@/components/lazy-input-preview";
import { input, inputSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/components/input",
	},
	description: input.description,
	title: input.title,
};

function InputApi() {
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
					<td className="px-5 py-4 font-mono">label</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ReactNode
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Renders an associated native label.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">description</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ReactNode
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Adds supporting text associated through aria-describedby.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">error, success</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ReactNode
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Announces validation feedback. Error takes precedence if both exist.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">startAdornment, endAdornment</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ReactNode
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Places decorative visual context before or after the input.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">containerClassName, className</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">string</td>
					<td className="px-5 py-4 text-muted-foreground">
						Extends the field layout and the native input presentation.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">...props</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ComponentPropsWithRef&lt;&quot;input&quot;&gt;
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Preserves native input attributes, form behavior, and forwarded
						refs.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function InputPage() {
	return (
		<CatalogItemPage
			api={<InputApi />}
			collection="component"
			name="input"
			preview={<LazyInputPreview />}
			source={inputSource}
		/>
	);
}

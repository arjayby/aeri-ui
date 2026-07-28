import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyTooltipPreview } from "@/components/lazy-tooltip-preview";
import { tooltip, tooltipSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/components/tooltip",
	},
	description: tooltip.description,
	title: tooltip.title,
};

function TooltipApi() {
	return (
		<table className="w-full min-w-xl text-left text-sm">
			<thead className="bg-muted/50 text-muted-foreground">
				<tr>
					<th className="px-5 py-3 font-medium">Part</th>
					<th className="px-5 py-3 font-medium">Properties</th>
					<th className="px-5 py-3 font-medium">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">TooltipProvider</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						delay, closeDelay, timeout
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Coordinates delay behavior for a group of Tooltips.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">Tooltip</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						open, defaultOpen, onOpenChange, disabled
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Groups its Trigger and Content with controlled or uncontrolled
						state.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">TooltipTrigger</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						delay, closeDelay, closeOnClick, disabled, render
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						The labelled control that opens the Tooltip through focus or hover.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">TooltipContent</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						side, sideOffset, align, alignOffset
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Positions concise supporting content around the trigger.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">...props</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						Base UI Tooltip props
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Preserves Base UI positioning, dismissal, and accessibility
						behavior.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function TooltipPage() {
	return (
		<CatalogItemPage
			api={<TooltipApi />}
			collection="component"
			name="tooltip"
			preview={<LazyTooltipPreview />}
			source={tooltipSource}
		/>
	);
}

import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageHeader } from "@/components/content-page-header";
import { CopyButton } from "@/components/copy-button";
import { InstallCommand } from "@/components/install-command";
import { LazyTabsPreview } from "@/components/lazy-tabs-preview";
import { catalogItems } from "@/lib/catalog";
import { tabs, tabsSource } from "@/lib/registry";

const documentation = tabs.docs
	.replace(/^## /, "")
	.split("\n## ")
	.map((section) => {
		const [heading, ...body] = section.split("\n\n");

		return { body: body.join("\n\n"), heading };
	})
	.filter((section) => section.heading !== "Installation");

const lifecycle = tabs.meta.lifecycle as string;
const catalogItem = catalogItems.find((item) => item.name === tabs.name);

if (!catalogItem) {
	throw new Error("The Tabs Catalog record is missing.");
}

const isNew = catalogItem.isNew;
const preview = tabs.meta.preview as { interaction: string };
const changelog = tabs.meta.changelog as Array<{
	date: string;
	summary: string;
	version: string;
}>;
const sourceUrl = tabs.meta.sourceUrl as string;
const example = tabs.meta.example as string;

export const metadata: Metadata = {
	title: "Tabs",
	description: tabs.description,
	alternates: { canonical: "/components/tabs" },
};

export default function TabsPage() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-5 py-14 sm:py-20 lg:px-10">
			<div className="flex flex-col gap-8">
				<Link
					className="inline-flex w-fit items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
					href="/components"
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
					Components
				</Link>
				<ContentPageHeader
					badges={[
						lifecycle === "preview" ? "Preview" : lifecycle,
						...(isNew ? ["New"] : []),
					]}
					description={tabs.description}
					title={tabs.title}
				/>
			</div>

			<section
				aria-labelledby="tabs-preview-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="tabs-preview-heading"
					>
						Live preview
					</h2>
					<p className="text-muted-foreground text-sm">{preview.interaction}</p>
				</div>
				<div className="aeri-grid rounded-[2rem] border border-border/70 bg-muted/20 p-5 sm:p-8">
					<LazyTabsPreview />
				</div>
			</section>

			<section
				aria-labelledby="tabs-install-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="tabs-install-heading"
					>
						Install
					</h2>
					<p className="text-muted-foreground text-sm">
						Add the complete Tabs source with the shadcn CLI.
					</p>
				</div>
				<InstallCommand itemName={tabs.name} />
			</section>

			<CodeSection
				copyLabel="usage example"
				fileName="example.tsx"
				heading="Usage"
				value={example}
			/>
			<section
				aria-labelledby="tabs-source-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div className="flex flex-col gap-2">
						<h2
							className="font-medium text-2xl tracking-[-0.03em]"
							id="tabs-source-heading"
						>
							Source
						</h2>
						<p className="text-muted-foreground text-sm">
							The complete source installed into your project.
						</p>
					</div>
					<a
						className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
						href={sourceUrl}
						rel="noreferrer"
						target="_blank"
					>
						View on GitHub
						<ExternalLink aria-hidden="true" className="size-4" />
					</a>
				</div>
				<CodeSection
					copyLabel="Tabs source"
					fileName="tabs.tsx"
					heading=""
					value={tabsSource}
				/>
			</section>

			<section
				aria-labelledby="tabs-api-heading"
				className="flex flex-col gap-5"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="tabs-api-heading"
				>
					API reference
				</h2>
				<div className="overflow-x-auto rounded-2xl border border-border/70">
					<table className="w-full min-w-xl text-left text-sm">
						<thead className="bg-muted/50 text-muted-foreground">
							<tr>
								<th className="px-5 py-3 font-medium">Part</th>
								<th className="px-5 py-3 font-medium">Key props</th>
								<th className="px-5 py-3 font-medium">Description</th>
							</tr>
						</thead>
						<tbody>
							<ApiRow
								description="Groups tabs and panels with controlled or uncontrolled selection."
								part="Tabs"
								props="value, defaultValue, onValueChange, orientation"
							/>
							<ApiRow
								description="Groups tabs and provides arrow-key focus behavior."
								part="TabsList"
								props="activateOnFocus, loopFocus"
							/>
							<ApiRow
								description="Selects a matching panel and preserves native button behavior."
								part="TabsTab"
								props="value, disabled, ...buttonProps"
							/>
							<ApiRow
								description="Follows the active tab when placed inside TabsList."
								part="TabsIndicator"
								props="...indicatorProps"
							/>
							<ApiRow
								description="Displays matching content with directional state transitions."
								part="TabsPanel"
								props="value, keepMounted, ...panelProps"
							/>
						</tbody>
					</table>
				</div>
			</section>

			<section
				aria-labelledby="tabs-documentation-heading"
				className="flex flex-col gap-8"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="tabs-documentation-heading"
				>
					Documentation
				</h2>
				<div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
					{documentation.map(({ body, heading }) => (
						<section className="flex flex-col gap-2" key={heading}>
							<h3 className="font-medium text-lg">{heading}</h3>
							<p className="whitespace-pre-line text-muted-foreground leading-7">
								{body}
							</p>
						</section>
					))}
				</div>
			</section>

			<section
				aria-labelledby="tabs-changelog-heading"
				className="flex flex-col gap-5"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="tabs-changelog-heading"
				>
					Changelog
				</h2>
				<ul className="flex flex-col rounded-2xl border border-border/70">
					{changelog.map((entry) => (
						<li
							className="grid gap-2 border-border/70 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[7rem_7rem_1fr]"
							key={entry.version}
						>
							<p className="font-mono text-sm">{entry.version}</p>
							<p className="text-muted-foreground text-sm">{entry.date}</p>
							<p className="text-sm">{entry.summary}</p>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}

function ApiRow({
	description,
	part,
	props,
}: {
	description: string;
	part: string;
	props: string;
}) {
	return (
		<tr className="border-border/70 border-t">
			<td className="px-5 py-4 font-mono">{part}</td>
			<td className="px-5 py-4 font-mono text-muted-foreground">{props}</td>
			<td className="px-5 py-4 text-muted-foreground">{description}</td>
		</tr>
	);
}

function CodeSection({
	copyLabel,
	fileName,
	heading,
	value,
}: {
	copyLabel: string;
	fileName: string;
	heading: string;
	value: string;
}) {
	return (
		<section className="flex flex-col gap-5">
			{heading ? (
				<h2 className="font-medium text-2xl tracking-[-0.03em]">{heading}</h2>
			) : null}
			<div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
				<div className="flex items-center justify-between border-border/70 border-b px-4 py-2">
					<p className="font-mono text-muted-foreground text-xs">{fileName}</p>
					<CopyButton label={copyLabel} value={value} />
				</div>
				<pre className="overflow-x-auto whitespace-pre-wrap break-words p-5 text-sm leading-7">
					<code>{value}</code>
				</pre>
			</div>
		</section>
	);
}

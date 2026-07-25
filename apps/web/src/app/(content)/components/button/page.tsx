import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageHeader } from "@/components/content-page-header";
import { CopyButton } from "@/components/copy-button";
import { InstallCommand } from "@/components/install-command";
import { button, buttonSource } from "@/lib/registry";
import { ButtonPreview } from "../../../../../../../registry/components/button/preview";

const documentation = button.docs
	.replace(/^## /, "")
	.split("\n## ")
	.map((section) => {
		const [heading, ...body] = section.split("\n\n");

		return { body: body.join("\n\n"), heading };
	})
	.filter((section) => section.heading !== "Installation");

const lifecycle = button.meta.lifecycle as string;
const preview = button.meta.preview as {
	initialLabel: string;
	interaction: string;
	label: string;
};
const changelog = button.meta.changelog as Array<{
	date: string;
	summary: string;
	version: string;
}>;
const sourceUrl = button.meta.sourceUrl as string;
const example = button.meta.example as string;

export const metadata: Metadata = {
	title: "Button",
	description: button.description,
	alternates: {
		canonical: "/components/button",
	},
};

export default function ButtonPage() {
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
					badge={lifecycle === "preview" ? "Preview component" : lifecycle}
					description={button.description}
					title={button.title}
				/>
			</div>

			<section
				aria-labelledby="button-preview-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="button-preview-heading"
					>
						Live preview
					</h2>
					<p className="text-muted-foreground text-sm">{preview.interaction}</p>
				</div>
				<div className="aeri-grid rounded-[2rem] border border-border/70 bg-muted/20 p-5 sm:p-8">
					<ButtonPreview label={preview.initialLabel} />
				</div>
			</section>

			<section
				aria-labelledby="button-install-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="button-install-heading"
					>
						Install
					</h2>
					<p className="text-muted-foreground text-sm">
						Add the complete Button source with the shadcn CLI.
					</p>
				</div>
				<InstallCommand />
			</section>

			<section
				aria-labelledby="button-usage-heading"
				className="flex flex-col gap-5"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="button-usage-heading"
				>
					Usage
				</h2>
				<div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
					<div className="flex items-center justify-between border-border/70 border-b px-4 py-2">
						<p className="font-mono text-muted-foreground text-xs">
							example.tsx
						</p>
						<CopyButton label="usage example" value={example} />
					</div>
					<pre className="overflow-x-auto p-5 text-sm leading-7">
						<code>{example}</code>
					</pre>
				</div>
			</section>

			<section
				aria-labelledby="button-source-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div className="flex flex-col gap-2">
						<h2
							className="font-medium text-2xl tracking-[-0.03em]"
							id="button-source-heading"
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
				<div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
					<div className="flex items-center justify-between border-border/70 border-b px-4 py-2">
						<p className="font-mono text-muted-foreground text-xs">
							button.tsx
						</p>
						<CopyButton label="Button source" value={buttonSource} />
					</div>
					<pre className="whitespace-pre-wrap break-words p-5 text-sm leading-7">
						<code>{buttonSource}</code>
					</pre>
				</div>
			</section>

			<section
				aria-labelledby="button-api-heading"
				className="flex flex-col gap-5"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="button-api-heading"
				>
					API reference
				</h2>
				<div className="overflow-x-auto rounded-2xl border border-border/70">
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
								<td className="px-5 py-4 font-mono">variant</td>
								<td className="px-5 py-4 font-mono text-muted-foreground">
									&quot;default&quot; | &quot;secondary&quot; |
									&quot;destructive&quot;
								</td>
								<td className="px-5 py-4 text-muted-foreground">
									Chooses the action&apos;s semantic emphasis.
								</td>
							</tr>
							<tr className="border-border/70 border-t">
								<td className="px-5 py-4 font-mono">pending</td>
								<td className="px-5 py-4 font-mono text-muted-foreground">
									boolean
								</td>
								<td className="px-5 py-4 text-muted-foreground">
									Disables repeated activation and shows pending feedback.
								</td>
							</tr>
							<tr className="border-border/70 border-t">
								<td className="px-5 py-4 font-mono">pendingText</td>
								<td className="px-5 py-4 font-mono text-muted-foreground">
									ReactNode
								</td>
								<td className="px-5 py-4 text-muted-foreground">
									Supplies localized feedback while work is pending.
								</td>
							</tr>
							<tr className="border-border/70 border-t">
								<td className="px-5 py-4 font-mono">className</td>
								<td className="px-5 py-4 font-mono text-muted-foreground">
									string
								</td>
								<td className="px-5 py-4 text-muted-foreground">
									Extends the local layout and presentation.
								</td>
							</tr>
							<tr className="border-border/70 border-t">
								<td className="px-5 py-4 font-mono">...props</td>
								<td className="px-5 py-4 font-mono text-muted-foreground">
									ButtonPrimitive.Props
								</td>
								<td className="px-5 py-4 text-muted-foreground">
									Preserves Base UI Button behavior and native attributes.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section
				aria-labelledby="button-documentation-heading"
				className="flex flex-col gap-8"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="button-documentation-heading"
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
				aria-labelledby="button-changelog-heading"
				className="flex flex-col gap-5"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="button-changelog-heading"
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

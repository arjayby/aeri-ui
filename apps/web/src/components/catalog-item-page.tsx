import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContentPageHeader } from "@/components/content-page-header";
import { CopyButton } from "@/components/copy-button";
import { InstallCommand } from "@/components/install-command";
import { PreviewInstallNotice } from "@/components/preview-install-notice";
import {
	catalogItems,
	getRegistryItemByName,
	type CatalogCollection,
} from "@/lib/catalog";

type ChangelogEntry = {
	date: string;
	summary: string;
	version: string;
};

type PreviewMetadata = {
	interaction?: string;
};

function getDocumentationSections(docs: string) {
	return docs
		.replace(/^## /, "")
		.split("\n## ")
		.map((section) => {
			const [heading, ...body] = section.split("\n\n");
			return { body: body.join("\n\n"), heading };
		})
		.filter((section) => section.heading !== "Installation");
}

function getChangelog(metadata: Record<string, unknown>): ChangelogEntry[] {
	if (!Array.isArray(metadata.changelog)) {
		return [];
	}

	return metadata.changelog.filter(
		(entry): entry is ChangelogEntry =>
			typeof entry === "object" &&
			entry !== null &&
			typeof entry.date === "string" &&
			typeof entry.summary === "string" &&
			typeof entry.version === "string",
	);
}

export function CatalogItemPage({
	api,
	collection,
	name,
	preview,
	source,
}: {
	api?: ReactNode;
	collection: CatalogCollection;
	name: string;
	preview?: ReactNode;
	source?: string;
}) {
	const catalogItem = catalogItems.find(
		(item) => item.collection === collection && item.name === name,
	);

	if (!catalogItem) {
		notFound();
	}

	const item = getRegistryItemByName(name);
	const metadata = item.meta as Record<string, unknown>;
	const example =
		typeof metadata.example === "string" ? metadata.example : undefined;
	const previewMetadata = metadata.preview as PreviewMetadata | undefined;
	const sourceUrl =
		typeof metadata.sourceUrl === "string" ? metadata.sourceUrl : undefined;
	const changelogUrl =
		typeof metadata.changelogUrl === "string"
			? metadata.changelogUrl
			: undefined;
	const changelog = getChangelog(metadata);
	const collectionLabel = collection === "component" ? "Components" : "Blocks";
	const collectionUrl = collection === "component" ? "/components" : "/blocks";

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-5 py-14 sm:py-20 lg:px-10">
			<div className="flex flex-col gap-8">
				<Link
					className="inline-flex w-fit items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
					href={collectionUrl}
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
					{collectionLabel}
				</Link>
				<ContentPageHeader
					badges={[
						`${catalogItem.lifecycle[0]?.toUpperCase()}${catalogItem.lifecycle.slice(1)}`,
						...(catalogItem.isNew ? ["New"] : []),
					]}
					description={catalogItem.description}
					title={catalogItem.title}
				/>
			</div>

			{preview ? (
				<section
					aria-labelledby={`${name}-preview-heading`}
					className="flex flex-col gap-5"
				>
					<div className="flex flex-col gap-2">
						<h2
							className="font-medium text-2xl tracking-[-0.03em]"
							id={`${name}-preview-heading`}
						>
							Live preview
						</h2>
						{previewMetadata?.interaction ? (
							<p className="text-muted-foreground text-sm">
								{previewMetadata.interaction}
							</p>
						) : null}
					</div>
					<div className="aeri-grid rounded-[2rem] border border-border/70 bg-muted/20 p-5 sm:p-8">
						{preview}
					</div>
				</section>
			) : null}

			<section
				aria-labelledby="install-heading"
				className="flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="install-heading"
					>
						Install
					</h2>
					<p className="text-muted-foreground text-sm">
						Add the complete {catalogItem.title} source with the shadcn CLI.
					</p>
					<PreviewInstallNotice lifecycle={catalogItem.lifecycle} />
				</div>
				<InstallCommand itemName={catalogItem.name} />
			</section>

			{example ? (
				<section
					aria-labelledby="usage-heading"
					className="flex flex-col gap-5"
				>
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="usage-heading"
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
						<pre className="whitespace-pre-wrap break-words p-5 text-sm leading-7">
							<code>{example}</code>
						</pre>
					</div>
				</section>
			) : null}

			{source ? (
				<section
					aria-labelledby="source-heading"
					className="flex flex-col gap-5"
				>
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div className="flex flex-col gap-2">
							<h2
								className="font-medium text-2xl tracking-[-0.03em]"
								id="source-heading"
							>
								Source
							</h2>
							<p className="text-muted-foreground text-sm">
								The complete source installed into your project.
							</p>
						</div>
						{sourceUrl ? (
							<a
								className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
								href={sourceUrl}
								rel="noreferrer"
								target="_blank"
							>
								View on GitHub
								<ExternalLink aria-hidden="true" className="size-4" />
							</a>
						) : null}
					</div>
					<div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
						<div className="flex items-center justify-between border-border/70 border-b px-4 py-2">
							<p className="font-mono text-muted-foreground text-xs">
								{name}.tsx
							</p>
							<CopyButton
								label={`${catalogItem.title} source`}
								value={source}
							/>
						</div>
						<pre className="whitespace-pre-wrap break-words p-5 text-sm leading-7">
							<code>{source}</code>
						</pre>
					</div>
				</section>
			) : null}

			{api ? (
				<section aria-labelledby="api-heading" className="flex flex-col gap-5">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="api-heading"
					>
						API reference
					</h2>
					<div className="overflow-x-auto rounded-2xl border border-border/70">
						{api}
					</div>
				</section>
			) : null}

			<section
				aria-labelledby="documentation-heading"
				className="flex flex-col gap-8"
			>
				<h2
					className="font-medium text-2xl tracking-[-0.03em]"
					id="documentation-heading"
				>
					Documentation
				</h2>
				<div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
					{getDocumentationSections(item.docs).map(({ body, heading }) => (
						<section className="flex flex-col gap-2" key={heading}>
							<h3 className="font-medium text-lg">{heading}</h3>
							<p className="whitespace-pre-line text-muted-foreground leading-7">
								{body}
							</p>
						</section>
					))}
				</div>
			</section>

			{changelog.length > 0 ? (
				<section
					aria-labelledby="changelog-heading"
					className="flex flex-col gap-5"
				>
					<div className="flex flex-wrap items-end justify-between gap-4">
						<h2
							className="font-medium text-2xl tracking-[-0.03em]"
							id="changelog-heading"
						>
							Changelog
						</h2>
						{changelogUrl ? (
							<a
								className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
								href={changelogUrl}
								rel="noreferrer"
								target="_blank"
							>
								View changelog
								<ExternalLink aria-hidden="true" className="size-4" />
							</a>
						) : null}
					</div>
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
			) : null}
		</main>
	);
}

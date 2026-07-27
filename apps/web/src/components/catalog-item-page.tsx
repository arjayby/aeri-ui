import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPageHeader } from "@/components/content-page-header";
import { InstallCommand } from "@/components/install-command";
import {
	catalogItems,
	getRegistryItemByName,
	type CatalogCollection,
} from "@/lib/catalog";

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

export function CatalogItemPage({
	collection,
	name,
}: {
	collection: CatalogCollection;
	name: string;
}) {
	const catalogItem = catalogItems.find(
		(item) => item.collection === collection && item.name === name,
	);

	if (!catalogItem) {
		notFound();
	}

	const item = getRegistryItemByName(name);
	const metadata = item.meta as Record<string, unknown>;
	const sourceUrl =
		typeof metadata.sourceUrl === "string" ? metadata.sourceUrl : undefined;
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
				</div>
				<InstallCommand itemName={catalogItem.name} />
			</section>

			<section
				aria-labelledby="documentation-heading"
				className="flex flex-col gap-8"
			>
				<div className="flex flex-wrap items-end justify-between gap-4">
					<h2
						className="font-medium text-2xl tracking-[-0.03em]"
						id="documentation-heading"
					>
						Documentation
					</h2>
					{sourceUrl ? (
						<a
							className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
							href={sourceUrl}
							rel="noreferrer"
							target="_blank"
						>
							View source on GitHub
							<ExternalLink aria-hidden="true" className="size-4" />
						</a>
					) : null}
				</div>
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
		</main>
	);
}

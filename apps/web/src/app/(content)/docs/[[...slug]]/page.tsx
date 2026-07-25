import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { getMDXComponents } from "@/components/mdx";
import { getLLMText, getPageImageUrl, source } from "@/lib/source";

type Props = {
	params: Promise<{ slug?: string[] }>;
};

export default async function DocumentationPage({ params }: Props) {
	const { slug } = await params;
	const page = source.getPage(slug);

	if (!page) notFound();

	const MDX = page.data.body;
	const markdown = await getLLMText(page);

	return (
		<main className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-20 lg:px-10">
			<article className="flex min-w-0 flex-col gap-10">
				<header className="flex flex-col gap-5 border-border/70 border-b pb-10">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<h1 className="text-balance font-medium text-4xl tracking-[-0.045em] sm:text-6xl">
							{page.data.title}
						</h1>
						<CopyButton label="introduction as Markdown" value={markdown} />
					</div>
					<p className="max-w-2xl text-pretty text-base text-muted-foreground leading-7 sm:text-lg">
						{page.data.description}
					</p>
				</header>
				<DocsBody className="aeri-docs-body max-w-none">
					<MDX
						components={getMDXComponents({
							a: createRelativeLink(source, page),
						})}
					/>
				</DocsBody>
			</article>
		</main>
	);
}

export function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const page = source.getPage(slug);

	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
		alternates: {
			canonical: page.url,
		},
		openGraph: {
			images: getPageImageUrl(page).url,
		},
	};
}

import {
	DocsBody,
	DocsDescription,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DocumentationNavigation } from "@/components/documentation-navigation";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

type Props = {
	params: Promise<{ slug?: string[] }>;
};

export default async function DocumentationPage({ params }: Props) {
	const { slug } = await params;
	const page = source.getPage(slug);

	if (!page) notFound();

	const MDX = page.data.body;
	return (
		<main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[13rem_minmax(0,1fr)_12rem] lg:px-8">
			<DocumentationNavigation tree={source.getPageTree()} />
			<article className="min-w-0">
				<p className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-[0.16em]">
					Aeri UI
				</p>
				<DocsTitle>{page.data.title}</DocsTitle>
				<DocsDescription>{page.data.description}</DocsDescription>
				<DocsBody>
					<MDX
						components={getMDXComponents({
							a: createRelativeLink(source, page),
						})}
					/>
				</DocsBody>
			</article>
			{page.data.toc.length > 0 ? (
				<nav aria-label="On this page" className="hidden lg:block lg:pt-3">
					<p className="mb-3 font-medium text-muted-foreground text-sm uppercase tracking-[0.16em]">
						On this page
					</p>
					<ul className="space-y-2 border-l pl-4 text-muted-foreground text-sm">
						{page.data.toc.map((item: { title: ReactNode; url: string }) => (
							<li key={item.url}>
								<a className="hover:text-foreground" href={item.url}>
									{item.title}
								</a>
							</li>
						))}
					</ul>
				</nav>
			) : (
				<div />
			)}
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
	};
}

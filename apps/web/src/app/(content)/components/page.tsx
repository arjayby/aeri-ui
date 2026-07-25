import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageHeader } from "@/components/content-page-header";
import { ButtonPreview } from "../../../../../../registry/components/button/preview";

export const metadata: Metadata = {
	title: "Components",
	description:
		"Polished interaction components you can install, own, and adapt.",
	alternates: {
		canonical: "/components",
	},
};

export default function ComponentsPage() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-14 sm:py-20 lg:px-10">
			<ContentPageHeader
				description="Polished interaction components you can install, own, and adapt. The collection is intentionally small while every item earns its place."
				title="Components"
			/>
			<article className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card lg:grid-cols-[0.8fr_1.2fr]">
				<div className="flex flex-col justify-between gap-12 p-7 sm:p-10">
					<div className="flex flex-col gap-4">
						<p className="text-muted-foreground text-sm">Actions</p>
						<h2 className="font-medium text-3xl tracking-[-0.04em]">Button</h2>
						<p className="text-muted-foreground leading-7">
							A semantic Button with restrained press feedback, accessible
							behavior, and no animation dependency.
						</p>
					</div>
					<Link
						className="inline-flex w-fit items-center gap-2 text-sm hover:text-muted-foreground"
						href="/components/button"
					>
						View Button
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>
				<div className="aeri-grid flex min-h-96 items-center justify-center border-border/70 border-t bg-muted/20 p-6 lg:border-t-0 lg:border-l">
					<ButtonPreview compact label="Save changes" />
				</div>
			</article>
		</main>
	);
}

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@aeri-ui/ui/components/empty";
import { Blocks } from "lucide-react";
import type { Metadata } from "next";

import { ContentPageHeader } from "@/components/content-page-header";

export const metadata: Metadata = {
	title: "Blocks",
	description:
		"Production ready interface sections composed from Aeri UI components.",
	alternates: {
		canonical: "/blocks",
	},
};

export default function BlocksPage() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 py-14 sm:py-20 lg:px-10">
			<ContentPageHeader
				description="Production ready interface sections composed from Aeri UI components. The collection will grow after the component foundation is ready."
				title="Blocks"
			/>
			<Empty className="aeri-grid min-h-[28rem] rounded-[2rem] border border-border/70 bg-card">
				<EmptyHeader>
					<EmptyMedia className="rounded-full" variant="icon">
						<Blocks aria-hidden="true" />
					</EmptyMedia>
					<EmptyTitle className="text-lg">Blocks are coming soon</EmptyTitle>
					<EmptyDescription>
						The first complete application patterns are being prepared for the
						same source ownership and quality contract as Components.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</main>
	);
}

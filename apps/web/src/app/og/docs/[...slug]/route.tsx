import { generate as DefaultImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPageImageUrl, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
	_request: Request,
	{ params }: RouteContext<"/og/docs/[...slug]">,
) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) notFound();

	return new ImageResponse(
		<DefaultImage
			description={page.data.description}
			site="Aeri UI"
			title={page.data.title}
		/>,
		{
			height: 630,
			width: 1200,
		},
	);
}

export function generateStaticParams() {
	return source.getPages().map((page) => ({
		slug: getPageImageUrl(page).segments,
	}));
}

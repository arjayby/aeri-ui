import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import {
	getCatalogItemMetadata,
	getCatalogItemParams,
} from "@/lib/catalog-route";

export function generateStaticParams() {
	return getCatalogItemParams("component");
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ item: string }>;
}): Promise<Metadata> {
	const { item: name } = await params;
	return getCatalogItemMetadata("component", name);
}

export default async function ComponentItemPage({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item } = await params;
	return <CatalogItemPage collection="component" name={item} />;
}

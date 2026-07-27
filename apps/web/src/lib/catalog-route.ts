import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogItems, type CatalogCollection } from "./catalog";

export function getCatalogItemParams(collection: CatalogCollection) {
	return getCatalogItems(collection).map(({ name }) => ({ item: name }));
}

export function getCatalogItemMetadata(
	collection: CatalogCollection,
	name: string,
): Metadata {
	const item = getCatalogItems(collection).find((entry) => entry.name === name);

	if (!item) {
		notFound();
	}

	return {
		alternates: { canonical: item.url },
		description: item.description,
		title: item.title,
	};
}

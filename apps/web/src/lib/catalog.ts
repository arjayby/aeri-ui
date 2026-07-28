import registry from "../../public/r/registry.json";

export const catalogCategories = [
	"action",
	"form",
	"navigation",
	"overlay",
	"feedback",
	"data-display",
	"content",
] as const;

export type CatalogCategory = (typeof catalogCategories)[number];
export type CatalogCollection = "component" | "block";
export type CatalogImplementation = "native" | "motion";
export type CatalogBoundary = "server" | "client";
export type CatalogLifecycle = "preview" | "stable" | "deprecated";

const categoryLabels: Record<CatalogCategory, string> = {
	action: "Actions",
	form: "Forms",
	navigation: "Navigation",
	overlay: "Overlays",
	feedback: "Feedback",
	"data-display": "Data Display",
	content: "Content",
};

type RegistryItem = (typeof registry.items)[number];

type CatalogMetadata = {
	boundary?: CatalogBoundary;
	implementation?: CatalogImplementation;
	publishedAt?: string;
};

export type CatalogItem = {
	boundary: CatalogBoundary;
	categories: CatalogCategory[];
	collection: CatalogCollection;
	description: string;
	hasBaseUi: boolean;
	implementation: CatalogImplementation;
	isNew: boolean;
	lifecycle: CatalogLifecycle;
	name: string;
	publishedAt?: string;
	searchContent: string;
	title: string;
	url: string;
};

function isCatalogCategory(value: string): value is CatalogCategory {
	return catalogCategories.includes(value as CatalogCategory);
}

function isLifecycle(value: unknown): value is CatalogLifecycle {
	return value === "preview" || value === "stable" || value === "deprecated";
}

function isRecentPublication(publishedAt?: string) {
	if (!publishedAt) {
		return false;
	}

	const published = new Date(`${publishedAt}T00:00:00.000Z`);
	const age = Date.now() - published.getTime();
	return age >= 0 && age <= 1000 * 60 * 60 * 24 * 30;
}

function toCatalogItem(item: RegistryItem): CatalogItem {
	const metadata = item.meta as Record<string, unknown>;
	const catalog = (metadata.catalog ?? {}) as CatalogMetadata;
	const collection = item.categories.includes("block") ? "block" : "component";
	const lifecycle = isLifecycle(metadata.lifecycle)
		? metadata.lifecycle
		: "preview";
	const categories = item.categories.filter(isCatalogCategory);
	const implementation =
		catalog.implementation === "motion" ? "motion" : "native";
	const boundary = catalog.boundary === "client" ? "client" : "server";
	const publishedAt = catalog.publishedAt;

	return {
		boundary,
		categories,
		collection,
		description: item.description,
		hasBaseUi: (item.dependencies as string[]).includes("@base-ui/react"),
		implementation,
		isNew: isRecentPublication(publishedAt),
		lifecycle,
		name: item.name,
		publishedAt,
		searchContent: [
			item.docs,
			typeof metadata.example === "string" ? metadata.example : "",
		].join(" "),
		title: item.title,
		url: `/${collection}s/${item.name}`,
	};
}

const registryItems = registry.items;
export const catalogItems = registryItems.map(toCatalogItem);

export function getCatalogItems(collection: CatalogCollection) {
	return catalogItems
		.filter((item) => item.collection === collection)
		.sort((first, second) =>
			(first.publishedAt ?? "").localeCompare(second.publishedAt ?? ""),
		);
}

export function getCategoryLabel(category: CatalogCategory) {
	return categoryLabels[category];
}

export function getRegistryItemByName(name: string) {
	const item = registryItems.find((entry) => entry.name === name);
	if (!item) {
		throw new Error(`The ${name} Registry Item record is missing.`);
	}

	return item;
}

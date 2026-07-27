"use client";

import { Button } from "@aeri-ui/ui/components/button";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
	catalogCategories,
	getCategoryLabel,
	type CatalogBoundary,
	type CatalogCategory,
	type CatalogCollection,
	type CatalogImplementation,
	type CatalogItem,
	type CatalogLifecycle,
} from "@/lib/catalog";

type CatalogBrowserProps = {
	collection: CatalogCollection;
	items: CatalogItem[];
};

type FilterOption<T extends string> = {
	label: string;
	value: T;
};

const implementationOptions: FilterOption<CatalogImplementation>[] = [
	{ label: "Native implementation", value: "native" },
	{ label: "Motion implementation", value: "motion" },
];

const boundaryOptions: FilterOption<CatalogBoundary>[] = [
	{ label: "Server compatible", value: "server" },
	{ label: "Client boundary", value: "client" },
];

const lifecycleOptions: FilterOption<CatalogLifecycle>[] = [
	{ label: "Preview", value: "preview" },
	{ label: "Stable", value: "stable" },
	{ label: "Deprecated", value: "deprecated" },
];

function FilterGroup<T extends string>({
	active,
	label,
	onChange,
	options,
}: {
	active?: T;
	label: string;
	onChange: (value?: T) => void;
	options: FilterOption<T>[];
}) {
	return (
		<div className="flex flex-col gap-2">
			<p className="font-medium text-muted-foreground text-xs">{label}</p>
			<div className="flex flex-wrap gap-2">
				{options.map((option) => (
					<Button
						aria-pressed={active === option.value}
						className="rounded-full"
						key={option.value}
						onClick={() =>
							onChange(active === option.value ? undefined : option.value)
						}
						size="sm"
						type="button"
						variant={active === option.value ? "secondary" : "ghost"}
					>
						{option.label}
					</Button>
				))}
			</div>
		</div>
	);
}

export function CatalogBrowser({ collection, items }: CatalogBrowserProps) {
	const [category, setCategory] = useState<CatalogCategory>();
	const [implementation, setImplementation] = useState<CatalogImplementation>();
	const [boundary, setBoundary] = useState<CatalogBoundary>();
	const [hasBaseUi, setHasBaseUi] = useState<boolean>();
	const [lifecycle, setLifecycle] = useState<CatalogLifecycle>();
	const [recentOnly, setRecentOnly] = useState(false);

	const filteredItems = useMemo(
		() =>
			items.filter((item) => {
				return (
					(!category || item.categories.includes(category)) &&
					(!implementation || item.implementation === implementation) &&
					(!boundary || item.boundary === boundary) &&
					(hasBaseUi === undefined || item.hasBaseUi === hasBaseUi) &&
					(!lifecycle || item.lifecycle === lifecycle) &&
					(!recentOnly || item.isNew)
				);
			}),
		[
			boundary,
			category,
			hasBaseUi,
			implementation,
			items,
			lifecycle,
			recentOnly,
		],
	);

	const groups = catalogCategories.map((value) => ({
		items: filteredItems.filter((item) => item.categories.includes(value)),
		label: getCategoryLabel(value),
		value,
	}));

	return (
		<div className="flex flex-col gap-12">
			<section
				aria-label={`${collection} filters`}
				className="flex flex-col gap-6 rounded-[2rem] border border-border/70 bg-card p-5 sm:p-7"
			>
				<FilterGroup
					active={category}
					label="Category"
					onChange={setCategory}
					options={catalogCategories.map((value) => ({
						label: getCategoryLabel(value),
						value,
					}))}
				/>
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					<FilterGroup
						active={implementation}
						label="Implementation"
						onChange={setImplementation}
						options={implementationOptions}
					/>
					<FilterGroup
						active={boundary}
						label="Rendering"
						onChange={setBoundary}
						options={boundaryOptions}
					/>
					<FilterGroup
						active={lifecycle}
						label="Lifecycle"
						onChange={setLifecycle}
						options={lifecycleOptions}
					/>
					<div className="flex flex-col gap-2">
						<p className="font-medium text-muted-foreground text-xs">
							Dependencies
						</p>
						<div className="flex flex-wrap gap-2">
							<Button
								aria-pressed={hasBaseUi === true}
								className="rounded-full"
								onClick={() =>
									setHasBaseUi(hasBaseUi === true ? undefined : true)
								}
								size="sm"
								type="button"
								variant={hasBaseUi === true ? "secondary" : "ghost"}
							>
								Uses Base UI
							</Button>
							<Button
								aria-pressed={hasBaseUi === false}
								className="rounded-full"
								onClick={() =>
									setHasBaseUi(hasBaseUi === false ? undefined : false)
								}
								size="sm"
								type="button"
								variant={hasBaseUi === false ? "secondary" : "ghost"}
							>
								No Base UI dependency
							</Button>
							<Button
								aria-pressed={recentOnly}
								className="rounded-full"
								onClick={() => setRecentOnly(!recentOnly)}
								size="sm"
								type="button"
								variant={recentOnly ? "secondary" : "ghost"}
							>
								Recently published
							</Button>
						</div>
					</div>
				</div>
			</section>

			{filteredItems.length === 0 ? (
				<p className="rounded-2xl border border-border/70 border-dashed px-5 py-12 text-center text-muted-foreground">
					No {collection === "component" ? "Components" : "Blocks"} match these
					filters.
				</p>
			) : (
				groups.map((group) =>
					group.items.length > 0 ? (
						<section className="flex flex-col gap-5" key={group.value}>
							<h2 className="font-medium text-2xl tracking-[-0.03em]">
								{group.label}
							</h2>
							<div className="grid gap-4 md:grid-cols-2">
								{group.items.map((item) => (
									<article
										className="flex min-h-64 flex-col justify-between rounded-[2rem] border border-border/70 bg-card p-6"
										key={item.name}
									>
										<div className="flex flex-col gap-4">
											<div className="flex flex-wrap gap-2 text-xs">
												<span className="rounded-full border border-border/70 px-2.5 py-1 text-muted-foreground">
													{item.lifecycle[0]?.toUpperCase()}
													{item.lifecycle.slice(1)}
												</span>
												{item.isNew ? (
													<span className="rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground">
														New
													</span>
												) : null}
											</div>
											<div className="flex flex-col gap-2">
												<h3 className="font-medium text-2xl tracking-tight">
													{item.title}
												</h3>
												<p className="text-muted-foreground leading-7">
													{item.description}
												</p>
											</div>
										</div>
										<div className="flex items-center justify-between gap-4 text-sm">
											<p className="text-muted-foreground">
												{item.implementation === "native"
													? "Native implementation"
													: "motion"}
											</p>
											<Link
												className="font-medium hover:text-muted-foreground"
												href={item.url as never}
											>
												View {item.title}
											</Link>
										</div>
									</article>
								))}
							</div>
						</section>
					) : null,
				)
			)}
		</div>
	);
}

"use client";

import { cn } from "@aeri-ui/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CatalogItem } from "@/lib/catalog";

type NavigationItem = Pick<CatalogItem, "collection" | "title" | "url">;

export function DocumentationNavigation({
	items,
}: {
	items: NavigationItem[];
}) {
	const pathname = usePathname();
	const groups = [
		{
			label: "Getting Started",
			links: [
				{ href: "/docs/", label: "Introduction" },
				{
					href: "/docs/release-candidate",
					label: "1.0 release candidate",
				},
			],
		},
		...(["component", "block"] as const).map((collection) => ({
			label: collection === "component" ? "Components" : "Blocks",
			links: [
				{
					href: collection === "component" ? "/components" : "/blocks",
					label: "Browse All",
				},
				...items
					.filter((item) => item.collection === collection)
					.map((item) => ({ href: item.url, label: item.title })),
			],
		})),
	];
	return (
		<nav aria-label="Documentation" className="flex flex-col gap-7">
			{groups.map((group) => (
				<div className="flex flex-col gap-2" key={group.label}>
					<p className="px-3 font-medium text-muted-foreground text-xs">
						{group.label}
					</p>
					<ul className="flex flex-col gap-0.5">
						{group.links.map((link) => {
							const active =
								pathname === link.href ||
								(link.href === "/docs/" && pathname === "/docs");

							return (
								<li key={link.href}>
									<Link
										aria-current={active ? "page" : undefined}
										className={cn(
											"block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground",
											active
												? "bg-muted text-foreground"
												: "text-muted-foreground",
										)}
										href={link.href as never}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</nav>
	);
}

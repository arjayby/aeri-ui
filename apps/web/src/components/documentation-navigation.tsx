"use client";

import { cn } from "@aeri-ui/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
	{
		label: "Getting Started",
		links: [{ href: "/docs/", label: "Introduction" }],
	},
	{
		label: "Components",
		links: [
			{ href: "/components", label: "Browse All" },
			{ href: "/components/button", label: "Button" },
		],
	},
	{
		label: "Blocks",
		links: [{ href: "/blocks", label: "Browse All" }],
	},
] as const;

export function DocumentationNavigation() {
	const pathname = usePathname();
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
										href={link.href}
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

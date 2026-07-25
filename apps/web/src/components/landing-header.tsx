import { Menu } from "lucide-react";
import Link from "next/link";

import { BrandLink } from "./brand-link";
import { UtilityActions } from "./utility-actions";

const links = [
	{ href: "/docs/", label: "Docs" },
	{ href: "/components", label: "Components" },
	{ href: "/blocks", label: "Blocks" },
] as const;

export function LandingHeader() {
	return (
		<header className="border-border/70 border-b">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
				<BrandLink />
				<nav
					aria-label="Main"
					className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-muted-foreground text-sm md:flex"
				>
					{links.map((link) => (
						<Link
							className="transition-colors hover:text-foreground"
							href={link.href}
							key={link.href}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="hidden md:block">
					<UtilityActions />
				</div>
				<details className="group relative md:hidden">
					<summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
						<Menu aria-hidden="true" className="size-4" />
						<span className="sr-only">Open navigation</span>
					</summary>
					<div className="absolute top-12 right-0 z-20 w-64 rounded-2xl border bg-popover p-3 shadow-xl">
						<nav aria-label="Mobile navigation" className="flex flex-col gap-1">
							{links.map((link) => (
								<Link
									className="rounded-xl px-3 py-2.5 text-sm hover:bg-muted"
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							))}
						</nav>
						<div className="mt-2 flex border-border/70 border-t pt-2">
							<UtilityActions />
						</div>
					</div>
				</details>
			</div>
		</header>
	);
}

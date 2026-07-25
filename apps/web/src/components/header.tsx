"use client";
import Link from "next/link";

import { DocumentationSearch } from "./documentation-search";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/items/button", label: "Button" },
		{ to: "/docs/", label: "Documentation" },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<DocumentationSearch />
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}

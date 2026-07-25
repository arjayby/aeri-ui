import Link from "next/link";

import { BrandLink } from "./brand-link";

export function SiteFooter() {
	return (
		<footer className="mt-24 border-border/70 border-t">
			<div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-12 md:grid-cols-[1fr_auto] lg:px-8">
				<div className="flex max-w-sm flex-col items-start gap-4">
					<BrandLink />
					<p className="text-muted-foreground text-sm leading-6">
						Polished interface source for production applications. Free forever
						and yours to shape.
					</p>
				</div>
				<nav
					aria-label="Footer"
					className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm"
				>
					<Link
						className="text-muted-foreground hover:text-foreground"
						href="/docs/"
					>
						Docs
					</Link>
					<a
						className="text-muted-foreground hover:text-foreground"
						href="https://github.com/arjayby/aeri-ui"
						rel="noreferrer"
						target="_blank"
					>
						GitHub
					</a>
					<Link
						className="text-muted-foreground hover:text-foreground"
						href="/components"
					>
						Components
					</Link>
					<Link
						className="text-muted-foreground hover:text-foreground"
						href="/blocks"
					>
						Blocks
					</Link>
				</nav>
			</div>
			<div className="mx-auto w-full max-w-7xl border-border/70 border-t px-5 py-5 text-muted-foreground text-xs lg:px-8">
				© 2026 Aeri UI.
			</div>
		</footer>
	);
}

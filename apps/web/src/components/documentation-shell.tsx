import { Menu } from "lucide-react";

import { BrandLink } from "./brand-link";
import { DocumentationNavigation } from "./documentation-navigation";
import { UtilityActions } from "./utility-actions";

export function DocumentationShell({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-svh">
			<aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-border/70 border-r bg-background lg:flex">
				<div className="flex h-16 items-center px-8">
					<BrandLink />
				</div>
				<div className="flex flex-1 flex-col overflow-y-auto px-5 py-7">
					<DocumentationNavigation />
				</div>
				<a
					className="mx-5 mb-5 rounded-xl border border-border/70 px-3 py-3 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://github.com/arjayby/aeri-ui"
					rel="noreferrer"
					target="_blank"
				>
					View Aeri UI on GitHub
				</a>
			</aside>

			<div className="lg:pl-72">
				<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-border/70 border-b bg-background/90 px-5 backdrop-blur lg:justify-end lg:px-8">
					<div className="lg:hidden">
						<BrandLink />
					</div>
					<div className="hidden lg:block">
						<UtilityActions />
					</div>
					<details className="group relative lg:hidden">
						<summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
							<Menu aria-hidden="true" className="size-4" />
							<span className="sr-only">Open documentation navigation</span>
						</summary>
						<div className="absolute top-12 right-0 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border bg-popover p-4 shadow-xl">
							<DocumentationNavigation />
							<div className="mt-4 flex border-border/70 border-t pt-3">
								<UtilityActions />
							</div>
						</div>
					</details>
				</header>
				{children}
			</div>
		</div>
	);
}

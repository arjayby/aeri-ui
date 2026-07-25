import type { Node, Root } from "fumadocs-core/page-tree";
import type { Route } from "next";
import Link from "next/link";

export function DocumentationNavigation({ tree }: { tree: Root }) {
	return (
		<nav aria-label="Documentation" className="lg:pt-3">
			<p className="mb-3 font-medium text-muted-foreground text-sm uppercase tracking-[0.16em]">
				Documentation
			</p>
			<ul className="space-y-1">
				{tree.children.map((node) => (
					<DocumentationNavigationNode key={node.$id} node={node} />
				))}
			</ul>
		</nav>
	);
}

function DocumentationNavigationNode({ node }: { node: Node }) {
	if (node.type === "separator") {
		return (
			<li className="px-3 pt-5 font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
				{node.name}
			</li>
		);
	}

	if (node.type === "folder") {
		return (
			<li className="pt-4 first:pt-0">
				<p className="px-3 font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
					{node.name}
				</p>
				<ul className="mt-1 space-y-1">
					{node.index ? (
						<DocumentationNavigationNode node={node.index} />
					) : null}
					{node.children.map((child) => (
						<DocumentationNavigationNode key={child.$id} node={child} />
					))}
				</ul>
			</li>
		);
	}

	const className =
		"block rounded-md px-3 py-2 text-sm hover:bg-muted focus-visible:bg-muted";

	return (
		<li>
			{node.external ? (
				<a className={className} href={node.url} rel="noreferrer">
					{node.name}
				</a>
			) : (
				<Link className={className} href={node.url as Route}>
					{node.name}
				</Link>
			)}
		</li>
	);
}

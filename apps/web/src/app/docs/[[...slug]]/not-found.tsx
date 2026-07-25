import Link from "next/link";

export default function DocumentationNotFound() {
	return (
		<main className="container mx-auto max-w-3xl px-4 py-16">
			<p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.16em]">
				Documentation
			</p>
			<h1 className="mt-4 font-semibold text-3xl tracking-tight">
				This page could not be found.
			</h1>
			<p className="mt-3 text-muted-foreground">
				This document may have moved or no longer exist.
			</p>
			<Link className="mt-6 inline-block underline" href="/docs/">
				Browse documentation
			</Link>
		</main>
	);
}

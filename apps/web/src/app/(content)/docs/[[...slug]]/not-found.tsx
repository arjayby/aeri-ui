import Link from "next/link";

export default function DocumentationNotFound() {
	return (
		<main className="mx-auto flex min-h-[60svh] w-full max-w-5xl flex-col justify-center gap-5 px-5 py-16 lg:px-10">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
				Documentation
			</p>
			<h1 className="font-medium text-4xl tracking-[-0.04em]">
				This page could not be found.
			</h1>
			<p className="max-w-lg text-muted-foreground leading-7">
				This document may have moved or may not be part of the current public
				documentation.
			</p>
			<Link className="w-fit underline underline-offset-4" href="/docs/">
				Browse documentation
			</Link>
		</main>
	);
}

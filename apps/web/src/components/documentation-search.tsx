"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { DefaultSearchDialogProps } from "fumadocs-ui/components/dialog/search-default";

type SearchDialogProps = Omit<DefaultSearchDialogProps, "dialogHandle">;

const SearchDialog = dynamic<SearchDialogProps>(
	async () => {
		const { default: Dialog } = await import(
			"fumadocs-ui/components/dialog/search-default"
		);

		return function DocumentationSearchDialog(props) {
			// Base UI accepts an omitted handle. Fumadocs reserves this prop for its provider.
			return <Dialog {...props} dialogHandle={undefined as never} />;
		};
	},
	{ ssr: false },
);

export function DocumentationSearch() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				aria-label="Search"
				className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onClick={() => setOpen(true)}
				type="button"
			>
				<Search aria-hidden="true" className="size-4" />
				<span>Search</span>
				<kbd className="hidden rounded border px-1.5 py-0.5 text-muted-foreground text-xs sm:inline">
					⌘K
				</kbd>
			</button>
			{open ? (
				<SearchDialog api="/api/search" onOpenChange={setOpen} open={open} />
			) : null}
		</>
	);
}

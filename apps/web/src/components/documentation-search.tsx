"use client";

import { Button } from "@aeri-ui/ui/components/button";
import type { DefaultSearchDialogProps } from "fumadocs-ui/components/dialog/search-default";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		function openSearch(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen(true);
			}
		}

		window.addEventListener("keydown", openSearch);
		return () => window.removeEventListener("keydown", openSearch);
	}, []);

	return (
		<>
			<Button
				aria-label="Search"
				className="rounded-full px-2 text-muted-foreground sm:px-3"
				onClick={() => setOpen(true)}
				size="sm"
				type="button"
				variant="ghost"
			>
				<Search aria-hidden="true" data-icon="inline-start" />
				<span className="hidden sm:inline">Search</span>
				<kbd className="hidden rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
					⌘K
				</kbd>
			</Button>
			{open ? (
				<SearchDialog api="/api/search" onOpenChange={setOpen} open={open} />
			) : null}
		</>
	);
}

"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyableCommandProps = {
	label: string;
	value: string;
};

export function CopyableCommand({ label, value }: CopyableCommandProps) {
	const [copied, setCopied] = useState(false);
	const buttonLabel = copied ? `Copied ${label}` : `Copy ${label}`;

	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	}

	return (
		<div className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-sm">
			<code
				className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users must be able to scroll the command.
				tabIndex={0}
			>
				{value}
			</code>
			<Button
				aria-label={buttonLabel}
				className="shrink-0 rounded-lg"
				onClick={copy}
				size="icon-sm"
				type="button"
				variant="ghost"
			>
				{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
				<span className="sr-only">{buttonLabel}</span>
			</Button>
		</div>
	);
}

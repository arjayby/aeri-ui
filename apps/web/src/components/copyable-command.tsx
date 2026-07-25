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

	async function copy() {
		await navigator.clipboard.writeText(value);
		setCopied(true);
	}

	return (
		<div className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-sm">
			<code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs">
				{value}
			</code>
			<Button
				aria-label={`Copy ${label}`}
				className="shrink-0 rounded-lg"
				onClick={copy}
				size="icon-sm"
				type="button"
				variant="ghost"
			>
				{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
			</Button>
		</div>
	);
}

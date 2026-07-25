"use client";

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
		<div className="flex items-start justify-between gap-3 overflow-x-auto rounded-[var(--radius)] bg-muted p-3 text-sm">
			<code>{value}</code>
			<button
				aria-label={`Copy ${label}`}
				className="shrink-0 rounded border bg-background px-2 py-1"
				onClick={copy}
				type="button"
			>
				{copied ? "Copied" : "Copy"}
			</button>
		</div>
	);
}

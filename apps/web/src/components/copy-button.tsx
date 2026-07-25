"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ label, value }: { label: string; value: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(value);
		setCopied(true);
	}

	return (
		<Button
			aria-label={`Copy ${label}`}
			className="rounded-lg"
			onClick={copy}
			size="sm"
			type="button"
			variant="ghost"
		>
			{copied ? (
				<Check aria-hidden="true" data-icon="inline-start" />
			) : (
				<Copy aria-hidden="true" data-icon="inline-start" />
			)}
			{copied ? "Copied" : "Copy"}
		</Button>
	);
}

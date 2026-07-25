"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { useState } from "react";

import { CopyableCommand } from "./copyable-command";

const commands = {
	npm: "npx shadcn@latest add @aeri-ui/button",
	pnpm: "pnpm dlx shadcn@latest add @aeri-ui/button",
	yarn: "yarn dlx shadcn@latest add @aeri-ui/button",
	bun: "bunx --bun shadcn@latest add @aeri-ui/button",
} as const;

type PackageManager = keyof typeof commands;

export function InstallCommand({ compact = false }: { compact?: boolean }) {
	const [manager, setManager] = useState<PackageManager>("npm");

	return (
		<div className="flex flex-col gap-3">
			{compact ? null : (
				<div aria-label="Package manager" className="flex gap-1" role="tablist">
					{Object.keys(commands).map((key) => {
						const value = key as PackageManager;
						const active = manager === value;

						return (
							<Button
								aria-selected={active}
								className="rounded-lg"
								key={value}
								onClick={() => setManager(value)}
								role="tab"
								size="sm"
								type="button"
								variant={active ? "secondary" : "ghost"}
							>
								{value}
							</Button>
						);
					})}
				</div>
			)}
			<CopyableCommand
				label={`${manager} installation command`}
				value={commands[manager]}
			/>
		</div>
	);
}

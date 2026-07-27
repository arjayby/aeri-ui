"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { useState } from "react";

import { CopyableCommand } from "./copyable-command";

function getCommands(itemName: string) {
	return {
		npm: `npx shadcn@latest add @aeri-ui/${itemName}`,
		pnpm: `pnpm dlx shadcn@latest add @aeri-ui/${itemName}`,
		yarn: `yarn dlx shadcn@latest add @aeri-ui/${itemName}`,
		bun: `bunx --bun shadcn@latest add @aeri-ui/${itemName}`,
	} as const;
}

type PackageManager = keyof ReturnType<typeof getCommands>;

export function InstallCommand({
	compact = false,
	itemName = "button",
}: {
	compact?: boolean;
	itemName?: string;
}) {
	const [manager, setManager] = useState<PackageManager>("npm");
	const commands = getCommands(itemName);

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

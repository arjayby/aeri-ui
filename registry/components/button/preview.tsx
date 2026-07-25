"use client";

import { type CSSProperties, useState } from "react";

import { Button } from "./button";

type ButtonPreviewProps = {
	compact?: boolean;
	label: string;
};

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & {
	"--primary": string;
	"--primary-foreground": string;
};

export function ButtonPreview({ compact = false, label }: ButtonPreviewProps) {
	const [acknowledged, setAcknowledged] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [viewport, setViewport] = useState<Viewport>("default");
	const themeStyle: ThemeStyle | undefined =
		theme === "ocean"
			? {
					"--primary": "oklch(0.5 0.13 235)",
					"--primary-foreground": "oklch(0.98 0.01 235)",
				}
			: undefined;

	return (
		<div className="flex w-full flex-col gap-4">
			{compact ? null : (
				<details className="rounded-xl border border-border/70 bg-background/70">
					<summary className="cursor-pointer list-none px-4 py-3 font-medium text-sm">
						Controls
					</summary>
					<fieldset className="flex flex-wrap gap-4 border-border/70 border-t px-4 py-4 text-sm">
						<label>
							Consumer Theme
							<select
								aria-label="Consumer Theme"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setTheme(event.target.value as ConsumerTheme)
								}
								value={theme}
							>
								<option value="neutral">Neutral</option>
								<option value="ocean">Ocean</option>
							</select>
						</label>
						<label>
							Viewport
							<select
								aria-label="Viewport"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setViewport(event.target.value as Viewport)
								}
								value={viewport}
							>
								<option value="default">Default</option>
								<option value="compact">Compact</option>
							</select>
						</label>
						<label className="flex items-center gap-2">
							<input
								checked={disabled}
								onChange={(event) => setDisabled(event.target.checked)}
								type="checkbox"
							/>
							Disabled
						</label>
						<label className="flex items-center gap-2">
							<input
								checked={reducedMotion}
								onChange={(event) => setReducedMotion(event.target.checked)}
								type="checkbox"
							/>
							Reduced motion
						</label>
					</fieldset>
				</details>
			)}
			<div
				className={
					reducedMotion
						? "[&_*]:!transform-none [&_*]:!transition-none"
						: undefined
				}
				data-consumer-theme={theme}
				style={{
					...themeStyle,
					maxWidth: compact ? viewportWidths.default : viewportWidths[viewport],
				}}
			>
				<div className="rounded-2xl border border-border/70 bg-background p-8 shadow-sm">
					<Button
						disabled={disabled}
						onClick={() => setAcknowledged(true)}
						type="button"
					>
						{label}
					</Button>
					<p
						aria-live="polite"
						className="mt-4 text-muted-foreground text-sm"
						role="status"
					>
						{acknowledged ? "Action acknowledged" : "Ready to save"}
					</p>
				</div>
			</div>
		</div>
	);
}

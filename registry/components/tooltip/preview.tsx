"use client";

import { type CSSProperties, useState } from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type Placement = "top" | "right" | "bottom" | "left";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--ring": "oklch(0.5 0.13 235)",
	},
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
	},
};

export function TooltipPreview() {
	const [disabled, setDisabled] = useState(false);
	const [placement, setPlacement] = useState<Placement>("top");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [viewport, setViewport] = useState<Viewport>("default");

	return (
		<div className="flex w-full flex-col gap-4">
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
							<option value="night">Night</option>
						</select>
					</label>
					<label>
						Placement
						<select
							aria-label="Placement"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setPlacement(event.target.value as Placement)
							}
							value={placement}
						>
							<option value="top">Top</option>
							<option value="right">Right</option>
							<option value="bottom">Bottom</option>
							<option value="left">Left</option>
						</select>
					</label>
					<label>
						Viewport
						<select
							aria-label="Viewport"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) => setViewport(event.target.value as Viewport)}
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
			<div
				className={
					reducedMotion
						? "[&_*]:!transform-none [&_*]:!transition-none"
						: undefined
				}
				data-consumer-theme={theme}
				data-tooltip-preview=""
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<div className="flex min-h-44 items-center justify-center rounded-2xl border border-border/70 bg-background p-8 shadow-sm">
					<TooltipProvider delay={250}>
						<Tooltip disabled={disabled}>
							<TooltipTrigger className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90">
								More information
							</TooltipTrigger>
							<TooltipContent
								id="more-information-description"
								side={placement}
							>
								Visible after a short delay. Press Escape to dismiss.
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}

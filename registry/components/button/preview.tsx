"use client";

import { useState, type CSSProperties } from "react";

import { Button } from "./button";

type ButtonPreviewProps = {
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

export function ButtonPreview({ label }: ButtonPreviewProps) {
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
		<div className="space-y-4">
			<fieldset className="flex flex-wrap gap-3 text-sm">
				<label>
					Consumer Theme
					<select
						aria-label="Consumer Theme"
						className="ml-2 rounded border bg-background px-2 py-1"
						onChange={(event) => setTheme(event.target.value as ConsumerTheme)}
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
						className="ml-2 rounded border bg-background px-2 py-1"
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
			<div
				className={
					reducedMotion
						? "[&_*]:!transform-none [&_*]:!transition-none"
						: undefined
				}
				data-consumer-theme={theme}
				style={{ ...themeStyle, maxWidth: viewportWidths[viewport] }}
			>
				<div className="rounded-[var(--radius)] border bg-background p-6">
					<Button
						disabled={disabled}
						onClick={() => setAcknowledged(true)}
						type="button"
					>
						{label}
					</Button>
					<p
						aria-live="polite"
						className="mt-3 text-muted-foreground text-sm"
						role="status"
					>
						{acknowledged ? "Action acknowledged" : "Ready to save"}
					</p>
				</div>
			</div>
		</div>
	);
}

"use client";

import { type CSSProperties, useState } from "react";

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "./tabs";

type TabsPreviewProps = {
	compact?: boolean;
};

type ConsumerTheme = "neutral" | "ocean" | "night";
type Orientation = "horizontal" | "vertical";
type TextDirection = "ltr" | "rtl";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
		"--muted": "oklch(0.27 0.02 260)",
		"--muted-foreground": "oklch(0.72 0.02 260)",
		"--primary": "oklch(0.8 0.1 235)",
	},
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--ring": "oklch(0.5 0.13 235)",
	},
};

export function TabsPreview({ compact = false }: TabsPreviewProps) {
	const [disabled, setDisabled] = useState(false);
	const [orientation, setOrientation] = useState<Orientation>("horizontal");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [viewport, setViewport] = useState<Viewport>("default");

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
								<option value="night">Night</option>
							</select>
						</label>
						<label>
							Orientation
							<select
								aria-label="Orientation"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setOrientation(event.target.value as Orientation)
								}
								value={orientation}
							>
								<option value="horizontal">Horizontal</option>
								<option value="vertical">Vertical</option>
							</select>
						</label>
						<label>
							Text direction
							<select
								aria-label="Text direction"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setTextDirection(event.target.value as TextDirection)
								}
								value={textDirection}
							>
								<option value="ltr">Left to right</option>
								<option value="rtl">Right to left</option>
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
							Disabled activity
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
				data-tabs-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: compact ? viewportWidths.default : viewportWidths[viewport],
				}}
			>
				<div className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
					<Tabs defaultValue="overview" orientation={orientation}>
						<TabsList activateOnFocus>
							<TabsTab value="overview">Overview</TabsTab>
							<TabsTab disabled={disabled} value="activity">
								Activity
							</TabsTab>
							<TabsTab value="settings">Settings</TabsTab>
							<TabsIndicator />
						</TabsList>
						<TabsPanel value="overview">
							<p className="font-medium">Plan your next move</p>
							<p className="mt-1 text-foreground/80 text-sm">
								Keep this project moving with a focused next step.
							</p>
						</TabsPanel>
						<TabsPanel value="activity">
							<p className="font-medium">No recent activity</p>
							<p className="mt-1 text-foreground/80 text-sm">
								Updates will appear here when work changes.
							</p>
						</TabsPanel>
						<TabsPanel value="settings">
							<p className="font-medium">Project settings</p>
							<p className="mt-1 text-foreground/80 text-sm">
								Adjust the details that shape your workspace.
							</p>
						</TabsPanel>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

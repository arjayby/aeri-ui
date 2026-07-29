"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { type CSSProperties, useState } from "react";

import { TextSwap } from "./text-swap";

const exampleStatuses = {
	localized: "Ihre Anfrage wird verarbeitet",
	processing: "Processing your request",
	ready: "Ready",
	review: "Your request is ready to review",
} as const;

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ExampleStatus = keyof typeof exampleStatuses;
type TextDirection = "ltr" | "rtl";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--primary-foreground": "oklch(0.98 0.01 235)",
	},
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
		"--muted-foreground": "oklch(0.76 0.02 260)",
	},
};

export function TextSwapPreview() {
	const [status, setStatus] = useState<ExampleStatus>("ready");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
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
						Example status
						<select
							aria-label="Example status"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setStatus(event.target.value as ExampleStatus)
							}
							value={status}
						>
							<option value="ready">Short</option>
							<option value="processing">Medium</option>
							<option value="review">Long</option>
							<option value="localized">Localized</option>
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
				data-consumer-theme={theme}
				data-text-swap-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<div className="flex min-h-64 flex-col justify-between gap-8 rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
					<div className="flex flex-col gap-2">
						<p className="text-muted-foreground text-sm">Request status</p>
						<TextSwap
							className="font-semibold text-2xl tracking-tight sm:text-3xl"
							content={exampleStatuses[status]}
							contentKey={status}
							reducedMotion={reducedMotion}
						/>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => setStatus("ready")}
							type="button"
							variant="secondary"
						>
							Show ready status
						</Button>
						<Button onClick={() => setStatus("processing")} type="button">
							Show processing status
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

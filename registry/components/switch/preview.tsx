"use client";

import { type CSSProperties, type FormEvent, useState } from "react";

import { Switch, SwitchThumb } from "./switch";

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
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
		"--input": "oklch(0.32 0.02 260)",
		"--muted-foreground": "oklch(0.76 0.02 260)",
	},
};

export function SwitchPreview() {
	const [checked, setChecked] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [status, setStatus] = useState(
		"Choose whether to receive release notes.",
	);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [viewport, setViewport] = useState<Viewport>("default");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setStatus(
			formData.has("release-notes")
				? "Release note preference saved: on"
				: "Release note preference saved: off",
		);
	}

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
				className={reducedMotion ? "[&_*]:!transition-none" : undefined}
				data-consumer-theme={theme}
				data-switch-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<form
					className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm"
					onSubmit={handleSubmit}
				>
					<label
						className="flex cursor-pointer items-center justify-between gap-4"
						htmlFor="release-notes"
					>
						<span className="flex flex-col gap-1">
							<span className="font-medium">Enable release notifications</span>
							<span className="text-muted-foreground text-sm">
								Receive a concise note when a new version is available.
							</span>
						</span>
						<Switch
							checked={checked}
							disabled={disabled}
							id="release-notes"
							name="release-notes"
							onCheckedChange={setChecked}
						>
							<SwitchThumb />
						</Switch>
					</label>
					<div className="mt-5 flex items-center gap-4">
						<button
							className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground text-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
							type="submit"
						>
							Save preferences
						</button>
						<p
							aria-live="polite"
							className="text-muted-foreground text-sm"
							role="status"
						>
							{status}
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

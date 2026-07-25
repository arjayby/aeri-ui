"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { Button, type ButtonVariant } from "./button";

type ButtonPreviewProps = {
	compact?: boolean;
	label: string;
};

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ContentLanguage = "arabic" | "english";
type TextDirection = "ltr" | "rtl";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const localizedContent = {
	arabic: {
		acknowledged: "تم حفظ التغييرات",
		pending: "جارٍ الحفظ",
		ready: "جاهز للحفظ",
	},
	english: {
		acknowledged: "Action acknowledged",
		pending: "Saving changes",
		ready: "Ready to save",
	},
};

export function ButtonPreview({ compact = false, label }: ButtonPreviewProps) {
	const [acknowledged, setAcknowledged] = useState(false);
	const [contentLanguage, setContentLanguage] =
		useState<ContentLanguage>("english");
	const [disabled, setDisabled] = useState(false);
	const [pending, setPending] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [variant, setVariant] = useState<ButtonVariant>("default");
	const [viewport, setViewport] = useState<Viewport>("default");
	const pendingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	useEffect(
		() => () => {
			if (pendingTimeout.current) {
				clearTimeout(pendingTimeout.current);
			}
		},
		[],
	);
	const themeStyle: ThemeStyle | undefined = {
		ocean: {
			"--primary": "oklch(0.5 0.13 235)",
			"--primary-foreground": "oklch(0.98 0.01 235)",
		},
		neutral: undefined,
		night: {
			"--background": "oklch(0.18 0.02 260)",
			"--destructive": "oklch(0.65 0.2 25)",
			"--destructive-foreground": "oklch(0.98 0.01 25)",
			"--foreground": "oklch(0.96 0.01 260)",
			"--primary": "oklch(0.8 0.1 235)",
			"--primary-foreground": "oklch(0.2 0.02 235)",
			"--secondary": "oklch(0.3 0.02 260)",
			"--secondary-foreground": "oklch(0.95 0.01 260)",
		},
	}[theme];

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
							Content language
							<select
								aria-label="Content language"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setContentLanguage(event.target.value as ContentLanguage)
								}
								value={contentLanguage}
							>
								<option value="english">English</option>
								<option value="arabic">Arabic</option>
							</select>
						</label>
						<label>
							Button variant
							<select
								aria-label="Button variant"
								className="ml-2 rounded-lg border bg-background px-2 py-1"
								onChange={(event) =>
									setVariant(event.target.value as ButtonVariant)
								}
								value={variant}
							>
								<option value="default">Primary</option>
								<option value="secondary">Secondary</option>
								<option value="destructive">Destructive</option>
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
			)}
			<div
				className={
					reducedMotion
						? "[&_*]:!transform-none [&_*]:!transition-none"
						: undefined
				}
				data-consumer-theme={theme}
				data-button-preview=""
				dir={textDirection}
				style={{
					...themeStyle,
					maxWidth: compact ? viewportWidths.default : viewportWidths[viewport],
				}}
			>
				<div className="rounded-2xl border border-border/70 bg-background p-8 shadow-sm">
					<Button
						disabled={disabled}
						onClick={() => {
							setAcknowledged(false);
							setPending(true);
							pendingTimeout.current = setTimeout(() => {
								setAcknowledged(true);
								setPending(false);
							}, 400);
						}}
						pending={pending}
						pendingText={localizedContent[contentLanguage].pending}
						type="button"
						variant={variant}
					>
						{contentLanguage === "english" ? label : "حفظ التغييرات"}
					</Button>
					<p
						aria-live="polite"
						className="mt-4 text-muted-foreground text-sm"
						role="status"
					>
						{acknowledged
							? localizedContent[contentLanguage].acknowledged
							: localizedContent[contentLanguage].ready}
					</p>
				</div>
			</div>
		</div>
	);
}

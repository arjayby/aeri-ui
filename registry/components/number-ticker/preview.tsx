"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { type CSSProperties, useState } from "react";

import { NumberTicker } from "./number-ticker";

const exampleValues = {
	decimal: 12450.75,
	large: 987654321.12,
	negative: -4200.5,
} as const;

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ExampleValue = keyof typeof exampleValues;
type NumberFormat = keyof typeof numberFormats;
type Locale = "ar-EG" | "de-DE" | "en-US";
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

const numberFormats = {
	compact: {
		compactDisplay: "short",
		maximumFractionDigits: 0,
		notation: "compact",
	},
	currency: {
		currency: "USD",
		minimumFractionDigits: 2,
		style: "currency",
	},
	decimal: {
		maximumFractionDigits: 2,
		style: "decimal",
	},
} satisfies Record<string, Intl.NumberFormatOptions>;

export function NumberTickerPreview() {
	const [{ example, value }, setValueState] = useState<{
		example: ExampleValue;
		value: number;
	}>({
		example: "decimal",
		value: exampleValues.decimal,
	});
	const [format, setFormat] = useState<NumberFormat>("currency");
	const [locale, setLocale] = useState<Locale>("en-US");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [viewport, setViewport] = useState<Viewport>("default");

	function chooseExample(nextExample: ExampleValue) {
		setValueState({
			example: nextExample,
			value: exampleValues[nextExample],
		});
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
						Example value
						<select
							aria-label="Example value"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								chooseExample(event.target.value as ExampleValue)
							}
							value={example}
						>
							<option value="decimal">Decimal</option>
							<option value="large">Large</option>
							<option value="negative">Negative</option>
						</select>
					</label>
					<label>
						Locale
						<select
							aria-label="Locale"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) => setLocale(event.target.value as Locale)}
							value={locale}
						>
							<option value="en-US">English, United States</option>
							<option value="de-DE">German, Germany</option>
							<option value="ar-EG">Arabic, Egypt</option>
						</select>
					</label>
					<label>
						Format
						<select
							aria-label="Format"
							className="ml-2 rounded-lg border bg-background px-2 py-1"
							onChange={(event) =>
								setFormat(event.target.value as NumberFormat)
							}
							value={format}
						>
							<option value="currency">Currency</option>
							<option value="decimal">Decimal</option>
							<option value="compact">Compact</option>
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
				data-number-ticker-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<div className="flex min-h-64 flex-col justify-between gap-8 rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
					<div className="flex flex-col gap-2">
						<p className="text-muted-foreground text-sm">Current revenue</p>
						<NumberTicker
							className="font-semibold text-4xl tracking-tight sm:text-5xl"
							formatOptions={numberFormats[format]}
							locales={locale}
							reducedMotion={reducedMotion}
							value={value}
						/>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() =>
								setValueState((current) => ({
									...current,
									value: current.value - 24680.25,
								}))
							}
							type="button"
							variant="secondary"
						>
							Decrease value
						</Button>
						<Button
							onClick={() =>
								setValueState((current) => ({
									...current,
									value: current.value + 24680.25,
								}))
							}
							type="button"
						>
							Increase value
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

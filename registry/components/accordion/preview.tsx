"use client";

import { type CSSProperties, useState } from "react";

import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "./accordion";

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
		"--muted": "oklch(0.26 0.02 260)",
		"--muted-foreground": "oklch(0.76 0.02 260)",
	},
};

export function AccordionPreview() {
	const [disabled, setDisabled] = useState(false);
	const [multiple, setMultiple] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [showDeliveryDetail, setShowDeliveryDetail] = useState(false);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [value, setValue] = useState<string[]>([]);
	const [viewport, setViewport] = useState<Viewport>("default");

	function handleMultipleChange(nextMultiple: boolean) {
		setMultiple(nextMultiple);
		setValue((currentValue) =>
			nextMultiple ? currentValue : currentValue.slice(0, 1),
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
							checked={multiple}
							onChange={(event) => handleMultipleChange(event.target.checked)}
							type="checkbox"
						/>
						Allow multiple sections
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
				data-accordion-preview=""
				data-consumer-theme={theme}
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<div className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:p-6">
					<Accordion multiple={multiple} onValueChange={setValue} value={value}>
						<AccordionItem disabled={disabled} value="delivery">
							<AccordionHeader>
								<AccordionTrigger>When will my order arrive?</AccordionTrigger>
							</AccordionHeader>
							<AccordionPanel>
								Most orders arrive in three to five business days.
								<button
									className="mt-3 block underline underline-offset-4"
									onClick={() => setShowDeliveryDetail((visible) => !visible)}
									type="button"
								>
									{showDeliveryDetail
										? "Hide delivery detail"
										: "Show delivery detail"}
								</button>
								{showDeliveryDetail ? (
									<p className="mt-2">
										Delivery estimates update when an order includes a made to
										order item or a destination outside our standard service
										area.
									</p>
								) : null}
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem disabled={disabled} value="address">
							<AccordionHeader>
								<AccordionTrigger>
									Can I change my delivery address?
								</AccordionTrigger>
							</AccordionHeader>
							<AccordionPanel>
								Yes, contact support before your order enters fulfillment.
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem disabled={disabled} value="returns">
							<AccordionHeader>
								<AccordionTrigger>How do returns work?</AccordionTrigger>
							</AccordionHeader>
							<AccordionPanel>
								Start a return within 30 days of delivery from your order
								confirmation.
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
}

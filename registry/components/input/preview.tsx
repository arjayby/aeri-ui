"use client";

import { type CSSProperties, useState } from "react";

import { Input } from "./input";

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ContentLanguage = "arabic" | "english";
type Feedback = "idle" | "typeMismatch" | "success" | "valueMissing";
type TextDirection = "ltr" | "rtl";
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
		"--input": "oklch(0.38 0.02 260)",
		"--muted": "oklch(0.27 0.02 260)",
		"--muted-foreground": "oklch(0.72 0.02 260)",
		"--primary": "oklch(0.8 0.1 235)",
	},
};

const localizedContent = {
	arabic: {
		description: "نستخدم هذا لإرسال تحديثات الحساب فقط.",
		label: "البريد الإلكتروني",
		placeholder: "you@example.com",
		save: "حفظ البريد الإلكتروني",
		success: "تم حفظ البريد الإلكتروني.",
		typeMismatch: "أدخل عنوان بريد إلكتروني كاملاً.",
		valueMissing: "أدخل عنوان بريد إلكتروني قبل الحفظ.",
	},
	english: {
		description: "We only use this to send account updates.",
		label: "Email address",
		placeholder: "you@example.com",
		save: "Save email",
		success: "Email saved.",
		typeMismatch: "Enter a complete email address.",
		valueMissing: "Enter an email address before saving.",
	},
};

export function InputPreview() {
	const [contentLanguage, setContentLanguage] =
		useState<ContentLanguage>("english");
	const [disabled, setDisabled] = useState(false);
	const [feedback, setFeedback] = useState<Feedback>("idle");
	const [readOnly, setReadOnly] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [required, setRequired] = useState(true);
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [value, setValue] = useState("grace@example.com");
	const [viewport, setViewport] = useState<Viewport>("default");
	const content = localizedContent[contentLanguage];

	return (
		<div className="flex w-full flex-col gap-4">
			<details className="rounded-xl border border-border/70 bg-background/70">
				<summary className="cursor-pointer list-none px-4 py-3 font-medium text-sm">
					Controls
				</summary>
				<fieldset className="flex flex-wrap gap-4 border-border/70 border-t px-4 py-4 text-sm">
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
							checked={readOnly}
							onChange={(event) => setReadOnly(event.target.checked)}
							type="checkbox"
						/>
						Read only
					</label>
					<label className="flex items-center gap-2">
						<input
							checked={required}
							onChange={(event) => setRequired(event.target.checked)}
							type="checkbox"
						/>
						Required
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
				data-input-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<form
					className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm"
					onSubmit={(event) => {
						event.preventDefault();
						setFeedback("success");
					}}
				>
					<Input
						autoComplete="email"
						description={content.description}
						disabled={disabled}
						endAdornment={<span aria-hidden="true">@</span>}
						error={
							feedback === "valueMissing"
								? content.valueMissing
								: feedback === "typeMismatch"
									? content.typeMismatch
									: undefined
						}
						label={content.label}
						name="email"
						onChange={(event) => {
							setFeedback("idle");
							setValue(event.target.value);
						}}
						onInvalid={(event) =>
							setFeedback(
								event.currentTarget.validity.valueMissing
									? "valueMissing"
									: "typeMismatch",
							)
						}
						placeholder={content.placeholder}
						readOnly={readOnly}
						required={required}
						success={feedback === "success" ? content.success : undefined}
						type="email"
						value={value}
					/>
					<button
						className="mt-4 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={disabled}
						type="submit"
					>
						{content.save}
					</button>
				</form>
			</div>
		</div>
	);
}

"use client";

import { type CSSProperties, useState } from "react";

import {
	SettingsForm,
	type SettingsFormLabels,
	type SettingsFormValues,
} from "./settings-form";

const viewportWidths = {
	compact: 320,
	default: 640,
} as const;

type ConsumerTheme = "neutral" | "ocean" | "night";
type ContentLanguage = "arabic" | "english";
type TextDirection = "ltr" | "rtl";
type Viewport = keyof typeof viewportWidths;
type ThemeStyle = CSSProperties & Record<`--${string}`, string | undefined>;

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
		"--muted": "oklch(0.25 0.02 260)",
		"--muted-foreground": "oklch(0.74 0.02 260)",
		"--primary": "oklch(0.8 0.1 235)",
		"--primary-foreground": "oklch(0.2 0.02 235)",
	},
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--primary-foreground": "oklch(0.98 0.01 235)",
	},
};

const localizedContent: Record<
	ContentLanguage,
	{
		invalidEmail: string;
		labels: SettingsFormLabels;
	}
> = {
	arabic: {
		invalidEmail: "أدخل عنوان بريد إلكتروني صالحاً.",
		labels: {
			description: "حدّث طريقة التواصل معك وتحديثات المنتج التي تتلقاها.",
			emailDescription: "نستخدمه للتواصل بشأن الحساب والمنتج.",
			emailLabel: "عنوان البريد الإلكتروني",
			noChanges: "لا توجد تغييرات لحفظها.",
			productUpdatesDescription: "تلقَّ تحديثات عرضية حول الميزات الجديدة.",
			productUpdatesLabel: "تحديثات المنتج",
			save: "حفظ الإعدادات",
			saved: "تم حفظ الإعدادات.",
			saveFailed: "تعذّر حفظ الإعدادات. حاول مرة أخرى.",
			saving: "جارٍ حفظ الإعدادات",
			title: "الإعدادات",
			unsavedChanges: "توجد تغييرات غير محفوظة.",
		},
	},
	english: {
		invalidEmail: "Enter a valid email address.",
		labels: {
			description:
				"Update how we contact you and which product updates you receive.",
			emailDescription: "Used for account and product communication.",
			emailLabel: "Email address",
			noChanges: "No changes to save.",
			productUpdatesDescription:
				"Receive occasional updates about new features.",
			productUpdatesLabel: "Product updates",
			save: "Save settings",
			saved: "Settings saved.",
			saveFailed: "We could not save your settings. Try again.",
			saving: "Saving settings",
			title: "Settings",
			unsavedChanges: "Unsaved changes.",
		},
	},
};

function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function SettingsFormPreview() {
	const [contentLanguage, setContentLanguage] =
		useState<ContentLanguage>("english");
	const [reducedMotion, setReducedMotion] = useState(false);
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
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
				className={reducedMotion ? "[&_*]:!transition-none" : undefined}
				data-consumer-theme={theme}
				data-settings-form-preview=""
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<SettingsForm
					initialValues={{
						email: "ada@example.com",
						productUpdates: true,
					}}
					labels={content.labels}
					onSubmit={async (values: SettingsFormValues) => {
						await new Promise((resolve) => setTimeout(resolve, 250));
						if (values.email.includes("failure")) {
							throw new Error("Preview save failed.");
						}
					}}
					onSaveSuccess={(values) => {
						if (values.email.includes("observer")) {
							throw new Error("Preview observer failed.");
						}
					}}
					onValidate={(values) =>
						isValidEmail(values.email)
							? undefined
							: { email: content.invalidEmail }
					}
				/>
			</div>
		</div>
	);
}

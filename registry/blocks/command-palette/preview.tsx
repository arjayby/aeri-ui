"use client";

import { type CSSProperties, useState } from "react";

import {
	CommandPalette,
	type CommandPaletteCommand,
	type CommandPaletteGroup,
} from "./command-palette";

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
		actions: "إجراءات",
		close: "إغلاق لوحة الأوامر",
		closeShortcut: "خروج",
		empty: "لم يتم العثور على أوامر.",
		home: "فتح الصفحة الرئيسية",
		invite: "دعوة زميل",
		navigation: "التنقل",
		open: "فتح لوحة الأوامر",
		opened: "تم فتح",
		placeholder: "البحث في الأوامر",
		projects: "فتح المشاريع",
		ready: "اختر أمراً",
		reports: "فتح التقارير",
		settings: "فتح الإعدادات",
	},
	english: {
		actions: "Actions",
		close: "Close command palette",
		closeShortcut: "Esc",
		empty: "No commands found.",
		home: "Open home",
		invite: "Invite teammate",
		navigation: "Navigation",
		open: "Open command palette",
		opened: "Opened",
		placeholder: "Search commands",
		projects: "Open projects",
		ready: "Choose a command",
		reports: "Open reports",
		settings: "Open settings",
	},
};

const themeStyles: Record<ConsumerTheme, ThemeStyle | undefined> = {
	neutral: undefined,
	night: {
		"--background": "oklch(0.18 0.02 260)",
		"--foreground": "oklch(0.96 0.01 260)",
		"--muted": "oklch(0.25 0.02 260)",
		"--muted-foreground": "oklch(0.74 0.02 260)",
		"--popover": "oklch(0.2 0.02 260)",
		"--popover-foreground": "oklch(0.96 0.01 260)",
		"--primary": "oklch(0.8 0.1 235)",
		"--primary-foreground": "oklch(0.2 0.02 235)",
	},
	ocean: {
		"--primary": "oklch(0.5 0.13 235)",
		"--primary-foreground": "oklch(0.98 0.01 235)",
	},
};

export function CommandPalettePreview() {
	const [contentLanguage, setContentLanguage] =
		useState<ContentLanguage>("english");
	const [open, setOpen] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [selectedCommand, setSelectedCommand] =
		useState<CommandPaletteCommand>();
	const [theme, setTheme] = useState<ConsumerTheme>("neutral");
	const [textDirection, setTextDirection] = useState<TextDirection>("ltr");
	const [viewport, setViewport] = useState<Viewport>("default");
	const content = localizedContent[contentLanguage];
	const commandGroups: CommandPaletteGroup[] = [
		{
			id: "navigation",
			label: content.navigation,
			commands: [
				{ id: "home", icon: "⌂", label: content.home, shortcut: "⌘H" },
				{
					id: "projects",
					icon: "▣",
					keywords: ["workspaces"],
					label: content.projects,
					shortcut: "⌘P",
				},
				{
					id: "reports",
					icon: "▤",
					keywords: ["analytics"],
					label: content.reports,
					shortcut: "⌘R",
				},
			],
		},
		{
			id: "actions",
			label: content.actions,
			commands: [
				{ id: "invite", icon: "+", label: content.invite, shortcut: "⌘I" },
				{ id: "settings", icon: "⚙", label: content.settings, shortcut: "⌘," },
			],
		},
	];

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
				data-command-palette-preview=""
				data-consumer-theme={theme}
				dir={textDirection}
				style={{
					...themeStyles[theme],
					maxWidth: viewportWidths[viewport],
				}}
			>
				<div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
					<button
						className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
						onClick={() => setOpen(true)}
						type="button"
					>
						{content.open}
					</button>
					<p
						aria-atomic="true"
						className="text-muted-foreground text-sm"
						role="status"
					>
						{selectedCommand
							? `${content.opened} ${selectedCommand.label.replace(
									contentLanguage === "english" ? "Open " : "فتح ",
									"",
								)}`
							: content.ready}
					</p>
					<CommandPalette
						closeLabel={content.close}
						closeShortcutLabel={content.closeShortcut}
						commands={commandGroups}
						dialogLabel={content.open}
						emptyLabel={content.empty}
						onOpenChange={setOpen}
						onSelect={setSelectedCommand}
						open={open}
						placeholder={content.placeholder}
					/>
				</div>
			</div>
		</div>
	);
}

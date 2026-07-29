export const launchSet = [
	{ expectedExport: "export {", name: "accordion" },
	{ expectedExport: "export { Button", name: "button" },
	{ expectedExport: "export {\n\tCommandPalette,", name: "command-palette" },
	{ expectedExport: "export {\n\tFileUpload,", name: "file-upload" },
	{ expectedExport: "export { Input", name: "input" },
	{ expectedExport: "export { NumberTicker", name: "number-ticker" },
	{ expectedExport: "export {\n\tSettingsForm,", name: "settings-form" },
	{ expectedExport: "export { Switch, SwitchThumb", name: "switch" },
	{ expectedExport: "export {\n\tTabs,", name: "tabs" },
	{ expectedExport: "export { TextSwap", name: "text-swap" },
	{ expectedExport: "export {\n\tTooltip,", name: "tooltip" },
] as const;

export const launchSetNames = launchSet.map((item) => item.name);

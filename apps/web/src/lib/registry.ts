import generatedAccordion from "../../public/r/accordion.json";
import generatedButton from "../../public/r/button.json";
import generatedCommandPalette from "../../public/r/command-palette.json";
import generatedFileUpload from "../../public/r/file-upload.json";
import generatedInput from "../../public/r/input.json";
import generatedNumberTicker from "../../public/r/number-ticker.json";
import generatedSettingsForm from "../../public/r/settings-form.json";
import generatedSwitch from "../../public/r/switch.json";
import generatedTabs from "../../public/r/tabs.json";
import generatedTextSwap from "../../public/r/text-swap.json";
import generatedTooltip from "../../public/r/tooltip.json";
import { getRegistryItemByName } from "./catalog";

const accordion = getRegistryItemByName("accordion");
const button = getRegistryItemByName("button");
const accordionSource = generatedAccordion.files[0]?.content;
const buttonSource = generatedButton.files[0]?.content;
const commandPalette = getRegistryItemByName("command-palette");
const commandPaletteSource = generatedCommandPalette.files[0]?.content;
const fileUpload = getRegistryItemByName("file-upload");
const fileUploadSource = generatedFileUpload.files[0]?.content;
const input = getRegistryItemByName("input");
const inputSource = generatedInput.files[0]?.content;
const numberTicker = getRegistryItemByName("number-ticker");
const numberTickerSource = generatedNumberTicker.files[0]?.content;
const settingsForm = getRegistryItemByName("settings-form");
const settingsFormSource = generatedSettingsForm.files[0]?.content;
const switchItem = getRegistryItemByName("switch");
const switchSource = generatedSwitch.files[0]?.content;
const tabs = getRegistryItemByName("tabs");
const tabsSource = generatedTabs.files[0]?.content;
const textSwap = getRegistryItemByName("text-swap");
const textSwapSource = generatedTextSwap.files[0]?.content;
const tooltip = getRegistryItemByName("tooltip");
const tooltipSource = generatedTooltip.files[0]?.content;

if (!accordionSource) {
	throw new Error("The generated Accordion source is missing.");
}

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

if (!commandPaletteSource) {
	throw new Error("The generated Command Palette source is missing.");
}

if (!fileUploadSource) {
	throw new Error("The generated File Upload source is missing.");
}

if (!inputSource) {
	throw new Error("The generated Input source is missing.");
}

if (!numberTickerSource) {
	throw new Error("The generated Number Ticker source is missing.");
}

if (!settingsFormSource) {
	throw new Error("The generated Settings Form source is missing.");
}

if (!switchSource) {
	throw new Error("The generated Switch source is missing.");
}

if (!tabsSource) {
	throw new Error("The generated Tabs source is missing.");
}

if (!textSwapSource) {
	throw new Error("The generated Text Swap source is missing.");
}

if (!tooltipSource) {
	throw new Error("The generated Tooltip source is missing.");
}

export {
	accordion,
	accordionSource,
	button,
	buttonSource,
	commandPalette,
	commandPaletteSource,
	fileUpload,
	fileUploadSource,
	input,
	inputSource,
	numberTicker,
	numberTickerSource,
	settingsForm,
	settingsFormSource,
	switchItem,
	switchSource,
	tabs,
	tabsSource,
	textSwap,
	textSwapSource,
	tooltip,
	tooltipSource,
};

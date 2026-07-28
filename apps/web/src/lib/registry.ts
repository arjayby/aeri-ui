import generatedAccordion from "../../public/r/accordion.json";
import generatedButton from "../../public/r/button.json";
import generatedInput from "../../public/r/input.json";
import generatedSwitch from "../../public/r/switch.json";
import generatedTabs from "../../public/r/tabs.json";
import generatedTooltip from "../../public/r/tooltip.json";
import { getRegistryItemByName } from "./catalog";

const accordion = getRegistryItemByName("accordion");
const button = getRegistryItemByName("button");
const accordionSource = generatedAccordion.files[0]?.content;
const buttonSource = generatedButton.files[0]?.content;
const input = getRegistryItemByName("input");
const inputSource = generatedInput.files[0]?.content;
const switchItem = getRegistryItemByName("switch");
const switchSource = generatedSwitch.files[0]?.content;
const tabs = getRegistryItemByName("tabs");
const tabsSource = generatedTabs.files[0]?.content;
const tooltip = getRegistryItemByName("tooltip");
const tooltipSource = generatedTooltip.files[0]?.content;

if (!accordionSource) {
	throw new Error("The generated Accordion source is missing.");
}

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

if (!inputSource) {
	throw new Error("The generated Input source is missing.");
}

if (!switchSource) {
	throw new Error("The generated Switch source is missing.");
}

if (!tabsSource) {
	throw new Error("The generated Tabs source is missing.");
}

if (!tooltipSource) {
	throw new Error("The generated Tooltip source is missing.");
}

export {
	accordion,
	accordionSource,
	button,
	buttonSource,
	input,
	inputSource,
	switchItem,
	switchSource,
	tabs,
	tabsSource,
	tooltip,
	tooltipSource,
};

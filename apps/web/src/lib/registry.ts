import generatedAccordion from "../../public/r/accordion.json";
import generatedButton from "../../public/r/button.json";
import generatedTabs from "../../public/r/tabs.json";
import { getRegistryItemByName } from "./catalog";

const accordion = getRegistryItemByName("accordion");
const button = getRegistryItemByName("button");
const accordionSource = generatedAccordion.files[0]?.content;
const buttonSource = generatedButton.files[0]?.content;
const tabs = getRegistryItemByName("tabs");
const tabsSource = generatedTabs.files[0]?.content;

if (!accordionSource) {
	throw new Error("The generated Accordion source is missing.");
}

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

if (!tabsSource) {
	throw new Error("The generated Tabs source is missing.");
}

export { accordion, accordionSource, button, buttonSource, tabs, tabsSource };

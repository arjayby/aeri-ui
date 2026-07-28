import generatedButton from "../../public/r/button.json";
import generatedTabs from "../../public/r/tabs.json";
import { getRegistryItemByName } from "./catalog";

const button = getRegistryItemByName("button");
const buttonSource = generatedButton.files[0]?.content;
const tabs = getRegistryItemByName("tabs");
const tabsSource = generatedTabs.files[0]?.content;

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

if (!tabsSource) {
	throw new Error("The generated Tabs source is missing.");
}

export { button, buttonSource, tabs, tabsSource };

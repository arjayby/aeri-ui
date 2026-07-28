import generatedAccordion from "../../public/r/accordion.json";
import generatedButton from "../../public/r/button.json";
import { getRegistryItemByName } from "./catalog";

const accordion = getRegistryItemByName("accordion");
const button = getRegistryItemByName("button");
const accordionSource = generatedAccordion.files[0]?.content;
const buttonSource = generatedButton.files[0]?.content;

if (!accordionSource) {
	throw new Error("The generated Accordion source is missing.");
}

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

export { accordion, accordionSource, button, buttonSource };

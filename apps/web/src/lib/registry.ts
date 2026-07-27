import generatedButton from "../../public/r/button.json";
import { getRegistryItemByName } from "./catalog";

const button = getRegistryItemByName("button");
const buttonSource = generatedButton.files[0]?.content;

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

export { button, buttonSource };

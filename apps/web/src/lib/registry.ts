import registry from "../../../../registry/components/button/registry.json";
import generatedButton from "../../public/r/button.json";

const registryButton = registry.items.find((item) => item.name === "button");

if (!registryButton) {
	throw new Error("The Button Registry Item record is missing.");
}

const button: (typeof registry.items)[number] = registryButton;
const buttonSource = generatedButton.files[0]?.content;

if (!buttonSource) {
	throw new Error("The generated Button source is missing.");
}

export { button, buttonSource };

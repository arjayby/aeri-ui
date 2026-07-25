import registry from "../../../../registry/components/button/registry.json";

const registryButton = registry.items.find((item) => item.name === "button");

if (!registryButton) {
	throw new Error("The Button Registry Item record is missing.");
}

const button: (typeof registry.items)[number] = registryButton;

export { button };

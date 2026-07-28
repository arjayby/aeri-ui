import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@/components/aeri/accordion";
import { Button as AeriButton } from "@/components/aeri/button";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<Button type="button">Consumer Project fixture</Button>
			<AeriButton type="button">Primary action</AeriButton>
			<AeriButton type="button" variant="secondary">
				Secondary action
			</AeriButton>
			<AeriButton type="button" variant="destructive">
				Delete item
			</AeriButton>
			<Accordion defaultValue={["shipping"]}>
				<AccordionItem value="shipping">
					<AccordionHeader>
						<AccordionTrigger>Shipping</AccordionTrigger>
					</AccordionHeader>
					<AccordionPanel>
						Orders arrive in three to five business days.
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</main>
	);
}

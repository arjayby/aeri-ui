import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@/components/aeri/accordion";
import { Button as AeriButton } from "@/components/aeri/button";
import {
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
} from "@/components/aeri/tabs";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main>
			<h1>Consumer Project fixture</h1>
			<Button type="button">Consumer Project fixture</Button>
			<AeriButton type="button">Primary action</AeriButton>
			<AeriButton type="button" variant="secondary">
				Secondary action
			</AeriButton>
			<AeriButton type="button" variant="destructive">
				Delete item
			</AeriButton>
			<h2>Order details</h2>
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
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTab value="overview">Overview</TabsTab>
					<TabsTab value="activity">Activity</TabsTab>
					<TabsIndicator />
				</TabsList>
				<TabsPanel value="overview">Overview content</TabsPanel>
				<TabsPanel value="activity">Activity content</TabsPanel>
			</Tabs>
		</main>
	);
}

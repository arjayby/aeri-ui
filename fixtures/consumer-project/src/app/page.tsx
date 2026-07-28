import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@/components/aeri/accordion";
import { Button as AeriButton } from "@/components/aeri/button";
import { Input } from "@/components/aeri/input";
import {
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
} from "@/components/aeri/tabs";
import { Switch, SwitchThumb } from "@/components/aeri/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/aeri/tooltip";
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
			<form>
				<Input
					autoComplete="email"
					description="Used for account notifications."
					label="Account email"
					name="account-email"
					required
					type="email"
				/>
				<label htmlFor="release-notes">
					<Switch defaultChecked id="release-notes" name="release-notes">
						<SwitchThumb />
					</Switch>
					Receive release notes
				</label>
			</form>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>More tooltip info</TooltipTrigger>
					<TooltipContent id="consumer-tooltip-description">
						More information about this setting.
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</main>
	);
}

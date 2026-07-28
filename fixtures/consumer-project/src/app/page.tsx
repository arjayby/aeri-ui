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
			<Button type="button">Consumer Project fixture</Button>
			<AeriButton type="button">Primary action</AeriButton>
			<AeriButton type="button" variant="secondary">
				Secondary action
			</AeriButton>
			<AeriButton type="button" variant="destructive">
				Delete item
			</AeriButton>
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

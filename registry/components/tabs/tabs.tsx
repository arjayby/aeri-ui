import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as React from "react";

function classNames(...values: Array<string | undefined>) {
	return values.filter(Boolean).join(" ");
}

function mergeClassName<State>(
	baseClassName: string,
	className: string | ((state: State) => string | undefined) | undefined,
) {
	if (typeof className === "function") {
		return (state: State) => classNames(baseClassName, className(state));
	}

	return classNames(baseClassName, className);
}

type TabsProps = TabsPrimitive.Root.Props;
type TabsListProps = TabsPrimitive.List.Props;
type TabsTabProps = TabsPrimitive.Tab.Props;
type TabsPanelProps = TabsPrimitive.Panel.Props;
type TabsIndicatorProps = TabsPrimitive.Indicator.Props;

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
	{ className, ...props },
	ref,
) {
	return (
		<TabsPrimitive.Root
			className={mergeClassName("flex flex-col gap-3", className)}
			data-slot="aeri-tabs"
			ref={ref}
			{...props}
		/>
	);
});

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
	function TabsList({ className, ...props }, ref) {
		return (
			<TabsPrimitive.List
				className={mergeClassName(
					"relative isolate inline-flex w-fit items-center rounded-lg bg-muted p-1 data-[orientation=vertical]:flex-col",
					className,
				)}
				data-slot="aeri-tabs-list"
				ref={ref}
				{...props}
			/>
		);
	},
);

const TabsTab = React.forwardRef<HTMLButtonElement, TabsTabProps>(
	function TabsTab({ className, ...props }, ref) {
		return (
			<TabsPrimitive.Tab
				className={mergeClassName(
					"relative z-10 inline-flex min-h-9 items-center justify-center rounded-md px-3 py-1.5 font-medium text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[active]:text-foreground motion-reduce:transition-none",
					className,
				)}
				data-slot="aeri-tabs-tab"
				ref={ref}
				{...props}
			/>
		);
	},
);

const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorProps>(
	function TabsIndicator({ className, ...props }, ref) {
		return (
			<TabsPrimitive.Indicator
				className={mergeClassName(
					"absolute bottom-1 left-0 z-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-primary transition-[translate,width,height] duration-200 ease-out data-[orientation=vertical]:start-auto data-[orientation=vertical]:end-1 data-[orientation=vertical]:top-0 data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:h-(--active-tab-height) data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:translate-y-(--active-tab-top) motion-reduce:transition-none",
					className,
				)}
				data-aeri-tabs-indicator=""
				data-slot="aeri-tabs-indicator"
				ref={ref}
				{...props}
			/>
		);
	},
);

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
	function TabsPanel({ className, ...props }, ref) {
		return (
			<TabsPrimitive.Panel
				className={mergeClassName(
					"rounded-xl border border-border/70 bg-background p-4 outline-none transition-[opacity,translate] duration-200 ease-out data-[activation-direction=left]:data-[ending-style]:translate-x-2 data-[activation-direction=left]:data-[starting-style]:-translate-x-2 data-[orientation=vertical]:data-[ending-style]:translate-x-0 data-[orientation=vertical]:data-[starting-style]:translate-x-0 data-[orientation=vertical]:data-[ending-style]:-translate-y-2 data-[orientation=vertical]:data-[starting-style]:translate-y-2 data-[ending-style]:-translate-x-2 data-[starting-style]:translate-x-2 data-[orientation=vertical]:data-[activation-direction=up]:data-[ending-style]:translate-y-2 data-[orientation=vertical]:data-[activation-direction=up]:data-[starting-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none motion-reduce:data-[ending-style]:transform-none motion-reduce:data-[starting-style]:transform-none",
					className,
				)}
				data-slot="aeri-tabs-panel"
				ref={ref}
				{...props}
			/>
		);
	},
);

export {
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
	type TabsIndicatorProps,
	type TabsListProps,
	type TabsPanelProps,
	type TabsProps,
	type TabsTabProps,
};

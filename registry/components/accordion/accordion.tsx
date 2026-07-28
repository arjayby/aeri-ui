"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import * as React from "react";

function joinClasses(...classes: Array<string | undefined>) {
	return classes.filter(Boolean).join(" ");
}

function mergeClassName<State>(
	base: string,
	className: string | ((state: State) => string | undefined) | undefined,
) {
	return (state: State) =>
		joinClasses(
			base,
			typeof className === "function" ? className(state) : className,
		);
}

type AccordionProps = AccordionPrimitive.Root.Props<string>;
type AccordionItemProps = AccordionPrimitive.Item.Props;
type AccordionHeaderProps = AccordionPrimitive.Header.Props;
type AccordionTriggerProps = AccordionPrimitive.Trigger.Props;
type AccordionPanelProps = AccordionPrimitive.Panel.Props;

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
	function Accordion({ className, ...props }, ref) {
		return (
			<AccordionPrimitive.Root
				className={mergeClassName<AccordionPrimitive.Root.State<string>>(
					"divide-y divide-border",
					className,
				)}
				data-slot="aeri-accordion"
				ref={ref}
				{...props}
			/>
		);
	},
);

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
	function AccordionItem({ className, ...props }, ref) {
		return (
			<AccordionPrimitive.Item
				className={mergeClassName<AccordionPrimitive.Item.State>(
					"py-1",
					className,
				)}
				data-slot="aeri-accordion-item"
				ref={ref}
				{...props}
			/>
		);
	},
);

const AccordionHeader = React.forwardRef<
	HTMLHeadingElement,
	AccordionHeaderProps
>(function AccordionHeader({ className, ...props }, ref) {
	return (
		<AccordionPrimitive.Header
			className={mergeClassName<AccordionPrimitive.Header.State>("", className)}
			data-slot="aeri-accordion-header"
			ref={ref}
			{...props}
		/>
	);
});

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
	function AccordionTrigger({ children, className, ...props }, ref) {
		return (
			<AccordionPrimitive.Trigger
				className={mergeClassName<AccordionPrimitive.Trigger.State>(
					"group flex min-h-11 w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-start font-medium text-sm outline-none transition-[background-color,color] duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
					className,
				)}
				data-slot="aeri-accordion-trigger"
				ref={ref}
				{...props}
			>
				{children}
				<span
					aria-hidden="true"
					className="flex size-5 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-45 motion-reduce:transition-none"
				>
					+
				</span>
			</AccordionPrimitive.Trigger>
		);
	},
);

const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
	function AccordionPanel({ children, className, ...props }, ref) {
		return (
			<AccordionPrimitive.Panel
				className={mergeClassName<AccordionPrimitive.Panel.State>(
					"h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none",
					className,
				)}
				data-slot="aeri-accordion-panel"
				ref={ref}
				{...props}
			>
				<div className="px-3 pt-1 pb-3 text-muted-foreground text-sm leading-6">
					{children}
				</div>
			</AccordionPrimitive.Panel>
		);
	},
);

export {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
	type AccordionHeaderProps,
	type AccordionItemProps,
	type AccordionPanelProps,
	type AccordionProps,
	type AccordionTriggerProps,
};

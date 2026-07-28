"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";

type TooltipContextValue = {
	contentId: string;
	describedBy?: string;
	open: boolean;
	setDescribedBy: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const TooltipContext = React.createContext<TooltipContextValue | undefined>(
	undefined,
);

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

type TooltipProps = TooltipPrimitive.Root.Props;
type TooltipProviderProps = TooltipPrimitive.Provider.Props;
type TooltipTriggerProps = TooltipPrimitive.Trigger.Props;
type TooltipContentProps = TooltipPrimitive.Popup.Props &
	Pick<
		TooltipPrimitive.Positioner.Props,
		"align" | "alignOffset" | "side" | "sideOffset"
	>;

function TooltipProvider({ delay = 500, ...props }: TooltipProviderProps) {
	return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function Tooltip({
	children,
	defaultOpen = false,
	onOpenChange,
	open: controlledOpen,
	...props
}: TooltipProps) {
	const contentId = React.useId();
	const [describedBy, setDescribedBy] = React.useState<string>();
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const open = controlledOpen ?? uncontrolledOpen;

	function handleOpenChange(
		nextOpen: boolean,
		eventDetails: TooltipPrimitive.Root.ChangeEventDetails,
	) {
		if (controlledOpen === undefined) {
			setUncontrolledOpen(nextOpen);
		}
		onOpenChange?.(nextOpen, eventDetails);
	}

	return (
		<TooltipContext.Provider
			value={{ contentId, describedBy, open, setDescribedBy }}
		>
			<TooltipPrimitive.Root
				defaultOpen={defaultOpen}
				onOpenChange={handleOpenChange}
				open={controlledOpen}
				{...props}
			>
				{children}
			</TooltipPrimitive.Root>
		</TooltipContext.Provider>
	);
}

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
	function TooltipTrigger(
		{ "aria-describedby": describedBy, className, ...props },
		ref,
	) {
		const context = React.useContext(TooltipContext);
		const ariaDescribedBy = [describedBy, context?.open && context.describedBy]
			.filter(Boolean)
			.join(" ");

		return (
			<TooltipPrimitive.Trigger
				aria-describedby={ariaDescribedBy || undefined}
				className={mergeClassName<TooltipPrimitive.Trigger.State>(
					"outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
					className,
				)}
				data-slot="aeri-tooltip-trigger"
				ref={ref as React.Ref<HTMLButtonElement>}
				{...props}
			/>
		);
	},
);

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
	function TooltipContent(
		{
			align = "center",
			alignOffset = 0,
			children,
			className,
			id,
			side = "top",
			sideOffset = 8,
			...props
		},
		ref,
	) {
		const context = React.useContext(TooltipContext);
		const contentId = id ?? context?.contentId;

		React.useEffect(() => {
			if (!contentId) {
				return;
			}

			context?.setDescribedBy(contentId);
			return () =>
				context?.setDescribedBy((currentId) =>
					currentId === contentId ? undefined : currentId,
				);
		}, [contentId, context?.setDescribedBy]);

		return (
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Positioner
					align={align}
					alignOffset={alignOffset}
					className="z-50"
					side={side}
					sideOffset={sideOffset}
				>
					<TooltipPrimitive.Popup
						className={mergeClassName<TooltipPrimitive.Popup.State>(
							"z-50 max-w-xs origin-(--transform-origin) rounded-lg bg-foreground px-3 py-1.5 text-background text-xs shadow-md transition-[opacity,scale,translate] duration-150 ease-out data-[side=left]:data-[ending-style]:translate-x-1 data-[side=left]:data-[starting-style]:translate-x-1 data-[side=right]:data-[ending-style]:-translate-x-1 data-[side=right]:data-[starting-style]:-translate-x-1 data-[side=bottom]:data-[ending-style]:-translate-y-1 data-[side=bottom]:data-[starting-style]:-translate-y-1 data-[side=top]:data-[ending-style]:translate-y-1 data-[side=top]:data-[starting-style]:translate-y-1 data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none motion-reduce:data-[ending-style]:transform-none motion-reduce:data-[starting-style]:transform-none",
							className,
						)}
						data-slot="aeri-tooltip-content"
						id={id ?? contentId}
						role="tooltip"
						ref={ref}
						{...props}
					>
						{children}
						<TooltipPrimitive.Arrow
							className="size-2.5 rotate-45 rounded-sm bg-foreground data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=top]:-bottom-1 data-[side=right]:-left-1"
							data-slot="aeri-tooltip-arrow"
						/>
					</TooltipPrimitive.Popup>
				</TooltipPrimitive.Positioner>
			</TooltipPrimitive.Portal>
		);
	},
);

export {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	type TooltipContentProps,
	type TooltipProps,
	type TooltipProviderProps,
	type TooltipTriggerProps,
};

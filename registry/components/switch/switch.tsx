import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
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

type SwitchProps = SwitchPrimitive.Root.Props;
type SwitchThumbProps = SwitchPrimitive.Thumb.Props;

const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
	{ className, ...props },
	ref,
) {
	return (
		<SwitchPrimitive.Root
			className={mergeClassName<SwitchPrimitive.Root.State>(
				"inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-input p-0.5 shadow-xs outline-none transition-[background-color,box-shadow,transform] duration-150 hover:bg-muted-foreground/30 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid focus-visible:outline-offset-2 active:scale-95 active:brightness-95 data-disabled:cursor-not-allowed data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100",
				className,
			)}
			data-slot="aeri-switch"
			ref={ref}
			{...props}
		/>
	);
});

const SwitchThumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
	function SwitchThumb({ className, ...props }, ref) {
		return (
			<SwitchPrimitive.Thumb
				className={mergeClassName<SwitchPrimitive.Thumb.State>(
					"pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-[translate,background-color] duration-150 data-checked:translate-x-5 motion-reduce:transition-none rtl:data-checked:-translate-x-5",
					className,
				)}
				data-slot="aeri-switch-thumb"
				ref={ref}
				{...props}
			/>
		);
	},
);

export { Switch, SwitchThumb, type SwitchProps, type SwitchThumbProps };

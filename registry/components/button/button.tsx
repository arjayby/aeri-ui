import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as React from "react";

type ButtonProps = ButtonPrimitive.Props;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ className, ...props },
	ref,
) {
	return (
		<ButtonPrimitive
			className={[
				"inline-flex min-h-9 items-center justify-center rounded-[var(--radius)] bg-primary px-3 font-medium text-primary-foreground text-sm transition-transform duration-150 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			data-slot="aeri-button"
			ref={ref}
			{...props}
		/>
	);
});

export { Button, type ButtonProps };

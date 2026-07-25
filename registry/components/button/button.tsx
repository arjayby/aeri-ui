import { Button as ButtonPrimitive } from "@base-ui/react/button";
import * as React from "react";

const buttonStyles = {
	base: "inline-flex min-h-9 items-center justify-center gap-2 rounded-[var(--radius)] px-3 font-medium text-sm transition-[transform,background-color,color,border-color] duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
	variant: {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive:
			"bg-destructive text-destructive-foreground hover:bg-destructive/90",
	},
} as const;

type ButtonVariant = keyof typeof buttonStyles.variant;
type ButtonProps = ButtonPrimitive.Props & {
	pending?: boolean;
	pendingText?: React.ReactNode;
	variant?: ButtonVariant;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		children,
		className,
		disabled,
		pending = false,
		pendingText,
		variant = "default",
		...props
	},
	ref,
) {
	return (
		<ButtonPrimitive
			aria-busy={pending || undefined}
			className={[buttonStyles.base, buttonStyles.variant[variant], className]
				.filter(Boolean)
				.join(" ")}
			data-variant={variant}
			data-slot="aeri-button"
			disabled={disabled || pending}
			ref={ref}
			{...props}
		>
			{pending ? (
				<>
					<span
						aria-hidden="true"
						className="size-3 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:hidden"
					/>
					<span>{pendingText ?? children}</span>
				</>
			) : (
				children
			)}
		</ButtonPrimitive>
	);
});

export { Button, type ButtonProps, type ButtonVariant };

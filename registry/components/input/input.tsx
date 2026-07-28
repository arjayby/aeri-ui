import * as React from "react";

function classNames(...values: Array<string | undefined>) {
	return values.filter(Boolean).join(" ");
}

type InputProps = React.ComponentPropsWithRef<"input"> & {
	containerClassName?: string;
	description?: React.ReactNode;
	endAdornment?: React.ReactNode;
	error?: React.ReactNode;
	label?: React.ReactNode;
	startAdornment?: React.ReactNode;
	success?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		"aria-describedby": ariaDescribedBy,
		"aria-errormessage": ariaErrorMessage,
		"aria-invalid": ariaInvalid,
		className,
		containerClassName,
		description,
		endAdornment,
		error,
		id,
		label,
		required,
		startAdornment,
		success,
		...props
	},
	ref,
) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = `${inputId}-description`;
	const messageId = `${inputId}-message`;
	const validationState =
		error !== undefined
			? "error"
			: success !== undefined
				? "success"
				: undefined;
	const describedBy = [
		ariaDescribedBy,
		description !== undefined ? descriptionId : undefined,
		validationState ? messageId : undefined,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames("grid gap-2", containerClassName)}>
			{label !== undefined ? (
				<label className="font-medium text-sm" htmlFor={inputId}>
					{label}
					{required ? <span aria-hidden="true"> *</span> : null}
				</label>
			) : null}
			<div
				className="flex items-center gap-2"
				data-slot="aeri-input-container"
				data-validation-state={validationState}
			>
				{startAdornment !== undefined ? (
					<span className="shrink-0 text-muted-foreground">
						{startAdornment}
					</span>
				) : null}
				<input
					aria-describedby={describedBy || undefined}
					aria-errormessage={
						validationState === "error"
							? (ariaErrorMessage ?? messageId)
							: ariaErrorMessage
					}
					aria-invalid={
						validationState === "error"
							? true
							: validationState === "success"
								? false
								: ariaInvalid
					}
					className={classNames(
						"flex h-10 min-w-0 flex-1 rounded-[var(--radius)] border bg-transparent px-3 py-2 text-base outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground read-only:cursor-default read-only:bg-muted/50 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
						validationState === "error"
							? "border-destructive focus-visible:outline-destructive"
							: validationState === "success"
								? "border-primary focus-visible:outline-primary"
								: "border-input focus-visible:outline-ring",
						className,
					)}
					data-slot="aeri-input"
					id={inputId}
					ref={ref}
					required={required}
					{...props}
				/>
				{endAdornment !== undefined ? (
					<span className="shrink-0 text-muted-foreground">{endAdornment}</span>
				) : null}
			</div>
			{description !== undefined ? (
				<p className="text-muted-foreground text-sm" id={descriptionId}>
					{description}
				</p>
			) : null}
			{validationState === "error" ? (
				<p className="text-destructive text-sm" id={messageId} role="alert">
					{error}
				</p>
			) : null}
			{validationState === "success" ? (
				<p className="text-primary text-sm" id={messageId} role="status">
					{success}
				</p>
			) : null}
		</div>
	);
});

export { Input, type InputProps };

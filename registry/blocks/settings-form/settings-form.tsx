"use client";

import * as React from "react";

import { Button } from "@/components/aeri/button";
import { Input } from "@/components/aeri/input";
import { Switch, SwitchThumb } from "@/components/aeri/switch";

type SettingsFormValues = {
	email: string;
	productUpdates: boolean;
};

type SettingsFormErrors = Partial<
	Record<keyof SettingsFormValues, React.ReactNode>
>;

type SettingsFormLabels = {
	description: string;
	emailDescription: string;
	emailLabel: string;
	noChanges: string;
	productUpdatesDescription: string;
	productUpdatesLabel: string;
	save: string;
	saved: string;
	saveFailed: string;
	saving: string;
	title: string;
	unsavedChanges: string;
};

type SettingsFormProps = {
	className?: string;
	disabled?: boolean;
	initialValues: SettingsFormValues;
	labels?: Partial<SettingsFormLabels>;
	onSaveFailure?: (error: unknown, values: SettingsFormValues) => void;
	onSaveSuccess?: (values: SettingsFormValues) => void;
	onSubmit: (values: SettingsFormValues) => void | Promise<void>;
	onValidate?: (values: SettingsFormValues) => SettingsFormErrors | undefined;
	onValuesChange?: (values: SettingsFormValues) => void;
};

const defaultLabels: SettingsFormLabels = {
	description:
		"Update how we contact you and which product updates you receive.",
	emailDescription: "Used for account and product communication.",
	emailLabel: "Email address",
	noChanges: "No changes to save.",
	productUpdatesDescription: "Receive occasional updates about new features.",
	productUpdatesLabel: "Product updates",
	save: "Save settings",
	saved: "Settings saved.",
	saveFailed: "We could not save your settings. Try again.",
	saving: "Saving settings",
	title: "Settings",
	unsavedChanges: "Unsaved changes.",
};

function hasErrors(errors: SettingsFormErrors) {
	return Object.values(errors).some((error) => error !== undefined);
}

function isSameValues(first: SettingsFormValues, second: SettingsFormValues) {
	return (
		first.email === second.email &&
		first.productUpdates === second.productUpdates
	);
}

function notifyOutcome(callback: () => void) {
	try {
		callback();
	} catch {
		return;
	}
}

function SettingsForm({
	className,
	disabled = false,
	initialValues,
	labels,
	onSaveFailure,
	onSaveSuccess,
	onSubmit,
	onValidate,
	onValuesChange,
}: SettingsFormProps) {
	const emailRef = React.useRef<HTMLInputElement>(null);
	const productUpdatesRef = React.useRef<HTMLElement>(null);
	const productUpdatesId = React.useId();
	const productUpdatesDescriptionId = `${productUpdatesId}-description`;
	const productUpdatesErrorId = `${productUpdatesId}-error`;
	const resolvedLabels = { ...defaultLabels, ...labels };
	const [values, setValues] = React.useState(initialValues);
	const [savedValues, setSavedValues] = React.useState(initialValues);
	const [errors, setErrors] = React.useState<SettingsFormErrors>({});
	const [submissionState, setSubmissionState] = React.useState<
		"idle" | "no-changes" | "saved" | "saving" | "failed"
	>("idle");
	const isDirty = !isSameValues(values, savedValues);
	const isSaving = submissionState === "saving";

	React.useEffect(() => {
		if (errors.email !== undefined) {
			emailRef.current?.focus();
			return;
		}

		if (errors.productUpdates !== undefined) {
			productUpdatesRef.current?.focus();
		}
	}, [errors]);

	function updateValues(nextValues: SettingsFormValues) {
		setValues(nextValues);
		setErrors({});
		setSubmissionState("idle");
		onValuesChange?.(nextValues);
	}

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (disabled || isSaving) {
			return;
		}

		if (!isDirty) {
			setSubmissionState("no-changes");
			return;
		}

		const nextErrors = onValidate?.(values) ?? {};
		if (hasErrors(nextErrors)) {
			setErrors(nextErrors);
			return;
		}

		setErrors({});
		setSubmissionState("saving");
		try {
			await onSubmit(values);
		} catch (error) {
			setSubmissionState("failed");
			notifyOutcome(() => onSaveFailure?.(error, values));
			return;
		}

		setSavedValues(values);
		setSubmissionState("saved");
		notifyOutcome(() => onSaveSuccess?.(values));
	}

	const status =
		submissionState === "failed"
			? resolvedLabels.saveFailed
			: submissionState === "no-changes"
				? resolvedLabels.noChanges
				: submissionState === "saved"
					? resolvedLabels.saved
					: submissionState === "saving"
						? resolvedLabels.saving
						: isDirty
							? resolvedLabels.unsavedChanges
							: undefined;

	return (
		<form
			className={["grid gap-6", className].filter(Boolean).join(" ")}
			data-slot="aeri-settings-form"
			noValidate
			onSubmit={submit}
		>
			<div className="grid gap-2">
				<h3 className="font-medium text-xl">{resolvedLabels.title}</h3>
				<p className="text-muted-foreground text-sm">
					{resolvedLabels.description}
				</p>
			</div>
			<Input
				description={resolvedLabels.emailDescription}
				disabled={disabled || isSaving}
				error={errors.email}
				label={resolvedLabels.emailLabel}
				onChange={(event) =>
					updateValues({ ...values, email: event.target.value })
				}
				ref={emailRef}
				type="email"
				value={values.email}
			/>
			<div className="grid gap-2">
				<div className="flex items-start justify-between gap-4 rounded-[var(--radius)] border border-border p-4">
					<div className="grid gap-1">
						<label className="font-medium text-sm" htmlFor={productUpdatesId}>
							{resolvedLabels.productUpdatesLabel}
						</label>
						<p
							className="text-muted-foreground text-sm"
							id={productUpdatesDescriptionId}
						>
							{resolvedLabels.productUpdatesDescription}
						</p>
					</div>
					<Switch
						aria-describedby={
							errors.productUpdates
								? `${productUpdatesDescriptionId} ${productUpdatesErrorId}`
								: productUpdatesDescriptionId
						}
						aria-errormessage={
							errors.productUpdates ? productUpdatesErrorId : undefined
						}
						aria-invalid={errors.productUpdates ? true : undefined}
						checked={values.productUpdates}
						disabled={disabled || isSaving}
						id={productUpdatesId}
						onCheckedChange={(productUpdates) =>
							updateValues({ ...values, productUpdates })
						}
						ref={productUpdatesRef}
					>
						<SwitchThumb />
					</Switch>
				</div>
				{errors.productUpdates !== undefined ? (
					<p
						className="text-destructive text-sm"
						id={productUpdatesErrorId}
						role="alert"
					>
						{errors.productUpdates}
					</p>
				) : null}
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p
					aria-atomic="true"
					className="text-muted-foreground text-sm"
					role="status"
				>
					{status}
				</p>
				<Button
					disabled={disabled}
					pending={isSaving}
					pendingText={resolvedLabels.saving}
					type="submit"
				>
					{resolvedLabels.save}
				</Button>
			</div>
		</form>
	);
}

export {
	SettingsForm,
	type SettingsFormErrors,
	type SettingsFormLabels,
	type SettingsFormProps,
	type SettingsFormValues,
};

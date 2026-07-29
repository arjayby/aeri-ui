"use client";

import * as React from "react";

type CommandPaletteCommand = {
	disabled?: boolean;
	id: string;
	icon?: React.ReactNode;
	keywords?: string[];
	label: string;
	onSelect?: () => void;
	shortcut?: React.ReactNode;
};

type CommandPaletteGroup = {
	commands: CommandPaletteCommand[];
	id: string;
	label: string;
};

type CommandPaletteProps = {
	closeLabel?: string;
	closeShortcutLabel?: string;
	commands: CommandPaletteGroup[];
	defaultOpen?: boolean;
	dialogLabel?: string;
	emptyLabel?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSelect?: (command: CommandPaletteCommand) => void;
	placeholder?: string;
};

type VisibleCommand = {
	command: CommandPaletteCommand;
	optionId: string;
};

type VisibleGroup = Omit<CommandPaletteGroup, "commands"> & {
	key: string;
	commands: VisibleCommand[];
};

function matchesQuery(
	command: CommandPaletteCommand,
	group: CommandPaletteGroup,
	query: string,
) {
	const content = [group.label, command.label, ...(command.keywords ?? [])]
		.join(" ")
		.toLocaleLowerCase();

	return content.includes(query.toLocaleLowerCase().trim());
}

function getFocusableElements(container: HTMLElement) {
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'button:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
		),
	).filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function CommandPalette({
	closeLabel = "Close command palette",
	closeShortcutLabel = "Esc",
	commands,
	defaultOpen = false,
	dialogLabel = "Command palette",
	emptyLabel = "No commands found.",
	open: controlledOpen,
	onOpenChange,
	onSelect,
	placeholder = "Search commands",
}: CommandPaletteProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const [query, setQuery] = React.useState("");
	const dialogRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);
	const listboxId = React.useId();
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const visibleGroups: VisibleGroup[] = React.useMemo(
		() =>
			commands
				.map((group, groupIndex) => ({
					...group,
					key: `${group.id}-${groupIndex}`,
					commands: group.commands
						.map((command, commandIndex) => ({
							command,
							optionId: `${listboxId}-option-${groupIndex}-${commandIndex}`,
						}))
						.filter(({ command }) => matchesQuery(command, group, query)),
				}))
				.filter((group) => group.commands.length > 0),
		[commands, listboxId, query],
	);
	const visibleCommands = visibleGroups.flatMap((group) => group.commands);
	const [activeOptionId, setActiveOptionId] = React.useState<string>();
	const activeCommand =
		visibleCommands.find((entry) => entry.optionId === activeOptionId) ??
		visibleCommands.find((entry) => !entry.command.disabled);

	React.useEffect(() => {
		if (
			!visibleCommands.some(
				(entry) => entry.optionId === activeCommand?.optionId,
			)
		) {
			setActiveOptionId(
				visibleCommands.find((entry) => !entry.command.disabled)?.optionId,
			);
		}
	}, [activeCommand?.optionId, visibleCommands]);

	React.useEffect(() => {
		if (!isOpen) {
			return;
		}

		previouslyFocusedElement.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		inputRef.current?.focus();

		return () => {
			previouslyFocusedElement.current?.focus();
			previouslyFocusedElement.current = null;
		};
	}, [isOpen]);

	function setOpen(nextOpen: boolean) {
		if (controlledOpen === undefined) {
			setUncontrolledOpen(nextOpen);
		}

		onOpenChange?.(nextOpen);
	}

	function selectCommand(command: CommandPaletteCommand) {
		if (command.disabled) {
			return;
		}

		command.onSelect?.();
		onSelect?.(command);
		setOpen(false);
	}

	function moveActiveCommand(offset: number) {
		const enabledCommands = visibleCommands.filter(
			(entry) => !entry.command.disabled,
		);
		if (enabledCommands.length === 0) {
			return;
		}

		const activeIndex = enabledCommands.findIndex(
			(entry) => entry.optionId === activeCommand?.optionId,
		);
		const nextIndex =
			(activeIndex + offset + enabledCommands.length) % enabledCommands.length;
		setActiveOptionId(enabledCommands[nextIndex]?.optionId);
	}

	function onDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === "Escape") {
			event.preventDefault();
			setOpen(false);
			return;
		}

		if (event.key !== "Tab") {
			return;
		}

		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}

		const focusableElements = getFocusableElements(dialog);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements.at(-1);
		if (!(firstElement && lastElement)) {
			event.preventDefault();
			return;
		}

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	}

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-start overflow-y-auto p-4 pt-[max(1rem,15vh)]">
			<button
				aria-hidden="true"
				className="absolute inset-0 cursor-default bg-foreground/25 backdrop-blur-sm"
				onClick={() => setOpen(false)}
				tabIndex={-1}
				type="button"
			/>
			<div
				aria-label={dialogLabel}
				aria-modal="true"
				className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl transition-[opacity,transform] duration-150 motion-reduce:transition-none"
				data-slot="aeri-command-palette"
				onKeyDown={onDialogKeyDown}
				ref={dialogRef}
				role="dialog"
			>
				<div className="flex items-center gap-3 border-border border-b px-4">
					<input
						aria-activedescendant={activeCommand?.optionId}
						aria-autocomplete="list"
						aria-controls={listboxId}
						aria-expanded="true"
						aria-label={placeholder}
						className="h-13 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
						onChange={(event) => setQuery(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "ArrowDown") {
								event.preventDefault();
								moveActiveCommand(1);
							}
							if (event.key === "ArrowUp") {
								event.preventDefault();
								moveActiveCommand(-1);
							}
							if (event.key === "Enter" && activeCommand) {
								event.preventDefault();
								selectCommand(activeCommand.command);
							}
						}}
						placeholder={placeholder}
						ref={inputRef}
						role="combobox"
						value={query}
					/>
					<button
						aria-label={closeLabel}
						className="rounded-md px-2 py-1 text-muted-foreground text-sm outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
						onClick={() => setOpen(false)}
						type="button"
					>
						{closeShortcutLabel}
					</button>
				</div>
				<div
					className="max-h-80 overflow-y-auto p-2"
					id={listboxId}
					role="listbox"
				>
					<p aria-atomic="true" className="sr-only" role="status">
						{visibleCommands.length === 0
							? emptyLabel
							: `${visibleCommands.length} command${visibleCommands.length === 1 ? "" : "s"} available.`}
					</p>
					{visibleGroups.length > 0 ? (
						visibleGroups.map((group) => (
							<fieldset className="py-2" key={group.key}>
								<legend className="px-3 pb-1 font-medium text-muted-foreground text-xs">
									{group.label}
								</legend>
								{group.commands.map(({ command, optionId }) => (
									<button
										aria-selected={activeCommand?.optionId === optionId}
										className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted disabled:cursor-not-allowed disabled:opacity-50 data-[active=true]:bg-muted motion-reduce:transition-none"
										data-active={
											activeCommand?.optionId === optionId || undefined
										}
										disabled={command.disabled}
										id={optionId}
										key={optionId}
										onClick={() => selectCommand(command)}
										onMouseMove={() => {
											if (!command.disabled) {
												setActiveOptionId(optionId);
											}
										}}
										role="option"
										tabIndex={-1}
										type="button"
									>
										{command.icon ? (
											<span
												aria-hidden="true"
												className="flex size-5 items-center justify-center"
											>
												{command.icon}
											</span>
										) : null}
										<span className="min-w-0 flex-1 truncate">
											{command.label}
										</span>
										{command.shortcut ? (
											<kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
												{command.shortcut}
											</kbd>
										) : null}
									</button>
								))}
							</fieldset>
						))
					) : (
						<p className="px-3 py-8 text-center text-muted-foreground text-sm">
							{emptyLabel}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export {
	CommandPalette,
	type CommandPaletteCommand,
	type CommandPaletteGroup,
	type CommandPaletteProps,
};

"use client";

import { useState } from "react";

import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
} from "@/components/aeri/accordion";
import { Button as AeriButton } from "@/components/aeri/button";
import {
	CommandPalette,
	type CommandPaletteGroup,
} from "@/components/aeri/command-palette";
import { FileUpload, type FileUploadFile } from "@/components/aeri/file-upload";
import { Input } from "@/components/aeri/input";
import { NumberTicker } from "@/components/aeri/number-ticker";
import { Switch, SwitchThumb } from "@/components/aeri/switch";
import {
	Tabs,
	TabsIndicator,
	TabsList,
	TabsPanel,
	TabsTab,
} from "@/components/aeri/tabs";
import { TextSwap } from "@/components/aeri/text-swap";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/aeri/tooltip";
import { Button } from "@/components/ui/button";

const commandGroups: CommandPaletteGroup[] = [
	{
		id: "navigation",
		label: "Navigation",
		commands: [
			{ id: "projects", label: "Open projects" },
			{ id: "reports", label: "Open reports" },
		],
	},
];

export default function Home() {
	const [accountValue, setAccountValue] = useState(12450.75);
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<FileUploadFile[]>([]);
	const [selectedCommand, setSelectedCommand] = useState("None");
	const [requestStatus, setRequestStatus] = useState("Ready");

	return (
		<main>
			<h1>Consumer Project fixture</h1>
			<Button type="button">Consumer Project fixture</Button>
			<AeriButton type="button">Primary action</AeriButton>
			<AeriButton type="button" variant="secondary">
				Secondary action
			</AeriButton>
			<AeriButton type="button" variant="destructive">
				Delete item
			</AeriButton>
			<h2>Quick actions</h2>
			<button onClick={() => setCommandPaletteOpen(true)} type="button">
				Open installed command palette
			</button>
			<p role="status">Selected command: {selectedCommand}</p>
			<CommandPalette
				commands={commandGroups}
				onOpenChange={setCommandPaletteOpen}
				onSelect={(command) => setSelectedCommand(command.id)}
				open={commandPaletteOpen}
			/>
			<h2>Attachments</h2>
			<FileUpload
				accept="image/png"
				description="Attach up to two PNG receipts."
				files={uploadedFiles}
				label="Attach receipts"
				maxFiles={2}
				onFileCancel={(file) =>
					setUploadedFiles((currentFiles) =>
						currentFiles.map((currentFile) =>
							currentFile.id === file.id
								? { ...currentFile, status: "cancelled" }
								: currentFile,
						),
					)
				}
				onFileRemove={(file) =>
					setUploadedFiles((currentFiles) =>
						currentFiles.filter((currentFile) => currentFile.id !== file.id),
					)
				}
				onFileRetry={(file) =>
					setUploadedFiles((currentFiles) =>
						currentFiles.map((currentFile) =>
							currentFile.id === file.id
								? {
										...currentFile,
										progress: 0,
										status: "uploading",
									}
								: currentFile,
						),
					)
				}
				onFilesSelected={(files) =>
					setUploadedFiles((currentFiles) => [
						...currentFiles,
						...files.map((file) => ({
							file,
							id: `${file.name}-${file.lastModified}`,
							progress: 0,
							status: "uploading" as const,
						})),
					])
				}
			/>
			<h2>Order details</h2>
			<Accordion defaultValue={["shipping"]}>
				<AccordionItem value="shipping">
					<AccordionHeader>
						<AccordionTrigger>Shipping</AccordionTrigger>
					</AccordionHeader>
					<AccordionPanel>
						Orders arrive in three to five business days.
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTab value="overview">Overview</TabsTab>
					<TabsTab value="activity">Activity</TabsTab>
					<TabsIndicator />
				</TabsList>
				<TabsPanel value="overview">Overview content</TabsPanel>
				<TabsPanel value="activity">Activity content</TabsPanel>
			</Tabs>
			<form>
				<Input
					autoComplete="email"
					description="Used for account notifications."
					label="Account email"
					name="account-email"
					required
					type="email"
				/>
				<label htmlFor="release-notes">
					<Switch defaultChecked id="release-notes" name="release-notes">
						<SwitchThumb />
					</Switch>
					Receive release notes
				</label>
			</form>
			<h2>Account value</h2>
			<NumberTicker
				formatOptions={{ currency: "USD", style: "currency" }}
				locales="en-US"
				value={accountValue}
			/>
			<button
				onClick={() => setAccountValue((current) => current + 24680.25)}
				type="button"
			>
				Increase account value
			</button>
			<h2>Request status</h2>
			<TextSwap content={requestStatus} contentKey={requestStatus} />
			<button
				onClick={() =>
					setRequestStatus((current) =>
						current === "Ready" ? "Processing your request" : "Ready",
					)
				}
				type="button"
			>
				Process request
			</button>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>More tooltip info</TooltipTrigger>
					<TooltipContent id="consumer-tooltip-description">
						More information about this setting.
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</main>
	);
}

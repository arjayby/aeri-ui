import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazyFileUploadPreview } from "@/components/lazy-file-upload-preview";
import { fileUpload, fileUploadSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/blocks/file-upload",
	},
	description: fileUpload.description,
	title: fileUpload.title,
};

function FileUploadApi() {
	return (
		<table className="w-full min-w-xl text-left text-sm">
			<thead className="bg-muted/50 text-muted-foreground">
				<tr>
					<th className="px-5 py-3 font-medium">Property</th>
					<th className="px-5 py-3 font-medium">Type</th>
					<th className="px-5 py-3 font-medium">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">files</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						FileUploadFile[]
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Consumer owned items with a file, stable id, status, optional
						progress, and optional error.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onFilesSelected</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(files) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Receives files selected through the picker or drop zone.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">
						onFileCancel, onFileRetry, onFileRemove
					</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(file) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Report user intent while the consumer owns cancellation, retry, and
						removal state changes.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">accept, maxFileSize, maxFiles</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						string, number
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Validates accepted types, byte size, and remaining file count before
						calling onFilesSelected.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">
						label, description, labels, validation messages
					</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						ReactNode, strings
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Provides consumer owned visible copy, accessible labels, and status
						announcements.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function FileUploadPage() {
	return (
		<CatalogItemPage
			api={<FileUploadApi />}
			collection="block"
			name="file-upload"
			preview={<LazyFileUploadPreview />}
			source={fileUploadSource}
		/>
	);
}

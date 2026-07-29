import type { Metadata } from "next";

import { CatalogItemPage } from "@/components/catalog-item-page";
import { LazySettingsFormPreview } from "@/components/lazy-settings-form-preview";
import { settingsForm, settingsFormSource } from "@/lib/registry";

export const metadata: Metadata = {
	alternates: {
		canonical: "/blocks/settings-form",
	},
	description: settingsForm.description,
	title: settingsForm.title,
};

function SettingsFormApi() {
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
					<td className="px-5 py-4 font-mono">initialValues</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						SettingsFormValues
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Supplies the initial email and product update preference.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onValuesChange</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(values) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Receives each local email or switch edit.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onValidate</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(values) =&gt; SettingsFormErrors | undefined
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Returns an object with optional email and productUpdates messages
						before submission. The first invalid field receives focus.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onSubmit</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(values) =&gt; void | Promise&lt;void&gt;
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Performs Builder owned persistence. Resolve to mark saved or reject
						to show failure feedback.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onSaveSuccess</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(values) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Observes a successful submission after the saved state is committed.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">onSaveFailure</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						(error, values) =&gt; void
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Observes a rejected submission after the failure state is committed.
					</td>
				</tr>
				<tr className="border-border/70 border-t">
					<td className="px-5 py-4 font-mono">labels, disabled, className</td>
					<td className="px-5 py-4 font-mono text-muted-foreground">
						Partial&lt;SettingsFormLabels&gt;, boolean, string
					</td>
					<td className="px-5 py-4 text-muted-foreground">
						Overrides title, descriptions, field labels, save labels, and dirty,
						saving, saved, failed, or unchanged messages; customizes disabled
						state or local layout.
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default function SettingsFormPage() {
	return (
		<CatalogItemPage
			api={<SettingsFormApi />}
			collection="block"
			name="settings-form"
			preview={<LazySettingsFormPreview />}
			source={settingsFormSource}
		/>
	);
}

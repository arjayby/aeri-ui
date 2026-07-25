import { button } from "@/lib/registry";
import { CopyableCommand } from "@/components/copyable-command";
import { ButtonPreview } from "../../../../../../registry/components/button/preview";

const commands = [
	{ label: "npm command", value: "npx shadcn@latest add @aeri-ui/button" },
	{
		label: "pnpm command",
		value: "pnpm dlx shadcn@latest add @aeri-ui/button",
	},
	{
		label: "Yarn command",
		value: "yarn dlx shadcn@latest add @aeri-ui/button",
	},
	{
		label: "Bun command",
		value: "bunx --bun shadcn@latest add @aeri-ui/button",
	},
] as const;

const documentation = button.docs
	.replace(/^## /, "")
	.split("\n## ")
	.map((section) => {
		const [heading, ...body] = section.split("\n\n");

		return { body: body.join("\n\n"), heading };
	});
const lifecycle = button.meta.lifecycle as string;
const preview = button.meta.preview as {
	initialLabel: string;
	interaction: string;
	label: string;
};
const changelog = button.meta.changelog as Array<{
	date: string;
	summary: string;
	version: string;
}>;
const sourceUrl = button.meta.sourceUrl as string;
const example = button.meta.example as string;
const registryConfiguration = `{
  "registries": {
    "@aeri-ui": "https://aeriui.dev/r/{name}.json"
  }
}`;

export default function ButtonItemPage() {
	return (
		<main className="mx-auto w-full max-w-4xl space-y-12 px-4 py-10 lg:px-8">
			<header className="space-y-3">
				<p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.16em]">
					{lifecycle === "preview" ? "Preview Item" : lifecycle}
				</p>
				<h1 className="font-semibold text-4xl tracking-tight">
					{button.title}
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">
					{button.description}
				</p>
			</header>

			<section aria-labelledby="button-preview-heading" className="space-y-4">
				<div>
					<h2 className="font-semibold text-2xl" id="button-preview-heading">
						Live Preview
					</h2>
					<p className="text-muted-foreground text-sm">{preview.interaction}</p>
				</div>
				<ButtonPreview label={preview.initialLabel} />
			</section>

			<section aria-labelledby="button-install-heading" className="space-y-4">
				<div>
					<h2 className="font-semibold text-2xl" id="button-install-heading">
						Install
					</h2>
					<p className="text-muted-foreground text-sm">
						For preview installs, add the Aeri UI registry URL to your
						<code className="mx-1 rounded bg-muted px-1 py-0.5">
							components.json
						</code>
						file before using one of these commands.
					</p>
				</div>
				<CopyableCommand
					label="registry configuration"
					value={registryConfiguration}
				/>
				<div className="space-y-3">
					{commands.map((command) => (
						<CopyableCommand
							key={command.label}
							label={command.label}
							value={command.value}
						/>
					))}
				</div>
			</section>

			<section aria-labelledby="button-usage-heading" className="space-y-3">
				<h2 className="font-semibold text-2xl" id="button-usage-heading">
					Usage
				</h2>
				<pre className="overflow-x-auto rounded-[var(--radius)] bg-muted p-3 text-sm">
					<code>{example}</code>
				</pre>
			</section>

			<section aria-labelledby="button-docs-heading" className="space-y-4">
				<h2 className="font-semibold text-2xl" id="button-docs-heading">
					Documentation
				</h2>
				<div className="space-y-5">
					{documentation.map(({ body, heading }) => {
						return (
							<section key={heading}>
								<h3 className="font-medium text-lg">{heading}</h3>
								<p className="mt-1 whitespace-pre-line text-muted-foreground">
									{body}
								</p>
							</section>
						);
					})}
				</div>
			</section>

			<section aria-labelledby="button-source-heading" className="space-y-3">
				<h2 className="font-semibold text-2xl" id="button-source-heading">
					Source and changelog
				</h2>
				<a className="underline underline-offset-4" href={sourceUrl}>
					View Button source
				</a>
				<ul className="space-y-1 text-muted-foreground">
					{changelog.map((entry) => (
						<li key={entry.version}>
							{entry.version} · {entry.date}: {entry.summary}
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}

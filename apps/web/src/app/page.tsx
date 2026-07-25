import { buttonVariants } from "@aeri-ui/ui/components/button";
import { cn } from "@aeri-ui/ui/lib/utils";
import { ArrowRight, Check, Code2, Layers3 } from "lucide-react";
import Link from "next/link";
import { InstallCommand } from "@/components/install-command";
import { LandingHeader } from "@/components/landing-header";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { ButtonPreview } from "../../../../registry/components/button/preview";

const steps = [
	{
		description:
			"Browse a small, curated collection and choose the interaction that fits your product.",
		title: "Pick a component",
	},
	{
		description:
			"Run one shadcn command to place the complete component source directly in your project.",
		title: "Run one command",
	},
	{
		description:
			"Keep the code, adapt the styles, and evolve it alongside the rest of your application.",
		title: "Make it yours",
	},
] as const;

const questions = [
	{
		answer:
			"Yes. Aeri UI is free to use in personal and commercial applications.",
		question: "Is Aeri UI free?",
	},
	{
		answer:
			"Aeri UI currently targets Next.js 16, React 19, Tailwind CSS 4, shadcn, and Base UI.",
		question: "Which projects are supported?",
	},
	{
		answer:
			"Yes. The shadcn CLI copies the component source into your repository, where you can edit and version it.",
		question: "Do I own the installed source?",
	},
	{
		answer:
			"Updates are explicit. Revisit the source or installation command when you want to evaluate a newer version.",
		question: "How do updates work?",
	},
	{
		answer:
			"Every item documents its runtime cost. The Button uses Base UI and adds no animation dependency.",
		question: "What dependencies do components add?",
	},
] as const;

export default function Home() {
	return (
		<div className="min-h-svh">
			<LandingHeader />
			<main>
				<section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-14 px-5 pt-24 pb-14 lg:px-8 lg:pt-32">
					<div className="flex max-w-3xl flex-col items-center gap-7 text-center">
						<h1 className="text-balance font-medium text-5xl tracking-[-0.055em] sm:text-7xl">
							Polished interactions,
							<br />
							ready to make yours.
						</h1>
						<p className="max-w-2xl text-pretty text-base text-muted-foreground leading-7 sm:text-lg">
							A free and open source registry of production ready components and
							blocks for Next.js and shadcn. Copy the source, shape it, ship it.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3">
							<Link
								className={cn(
									buttonVariants({ size: "lg" }),
									"rounded-full px-5",
								)}
								href="/docs/"
							>
								Get started
								<ArrowRight aria-hidden="true" data-icon="inline-end" />
							</Link>
							<Link
								className={cn(
									buttonVariants({ size: "lg", variant: "ghost" }),
									"rounded-full px-5",
								)}
								href="/components"
							>
								Browse components
							</Link>
						</div>
					</div>

					<section
						aria-label="Future component showcase"
						className="aeri-grid relative min-h-[29rem] w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card"
					>
						<div className="aeri-noise absolute inset-0 opacity-20" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,color-mix(in_oklch,var(--ring)_16%,transparent),transparent_45%)]" />
						<div className="absolute inset-x-0 bottom-0 grid border-border/70 border-t bg-background/75 backdrop-blur md:grid-cols-3">
							{[
								["Component", "1"],
								["Free", "Forever"],
								["Install", "One command"],
							].map(([label, value], index) => (
								<div
									className={cn(
										"flex min-h-28 flex-col justify-between gap-4 px-6 py-5",
										index > 0 &&
											"border-border/70 border-t md:border-t-0 md:border-l",
									)}
									key={label}
								>
									<p className="text-muted-foreground text-sm">{label}</p>
									<p className="font-medium text-2xl tracking-tight">{value}</p>
								</div>
							))}
						</div>
					</section>
				</section>

				<section className="border-border/70 border-t">
					<div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-24 lg:px-8">
						<div className="flex items-end justify-between gap-8">
							<SectionHeading
								eyebrow="The library"
								title="Every detail earns its place."
							/>
							<Link
								className="hidden items-center gap-2 text-muted-foreground text-sm hover:text-foreground sm:flex"
								href="/components"
							>
								Browse all
								<ArrowRight aria-hidden="true" className="size-4" />
							</Link>
						</div>
						<div className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card lg:grid-cols-[0.75fr_1.25fr]">
							<div className="flex flex-col justify-between gap-12 p-7 sm:p-10">
								<div className="flex flex-col gap-4">
									<p className="text-muted-foreground text-sm">Actions</p>
									<h3 className="font-medium text-3xl tracking-[-0.04em]">
										Button
									</h3>
									<p className="max-w-sm text-muted-foreground leading-7">
										A semantic Button with restrained press feedback and
										complete ownership of the source.
									</p>
								</div>
								<Link
									className="inline-flex items-center gap-2 text-sm hover:text-muted-foreground"
									href="/components/button"
								>
									View component
									<ArrowRight aria-hidden="true" className="size-4" />
								</Link>
							</div>
							<div className="aeri-grid flex min-h-96 items-center justify-center border-border/70 border-t bg-muted/20 p-6 lg:border-t-0 lg:border-l">
								<ButtonPreview compact label="Save changes" />
							</div>
						</div>
					</div>
				</section>

				<section className="border-border/70 border-t">
					<div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
						<SectionHeading eyebrow="How it works" title="Copy, shape, ship." />
						<ol className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-card">
							{steps.map((step, index) => (
								<li
									className="grid gap-4 border-border/70 border-b p-7 last:border-b-0 sm:grid-cols-[3rem_1fr] sm:p-9"
									key={step.title}
								>
									<p className="font-mono text-muted-foreground text-sm">
										0{index + 1}
									</p>
									<div className="flex flex-col gap-2">
										<h3 className="font-medium text-xl tracking-tight">
											{step.title}
										</h3>
										<p className="text-muted-foreground leading-7">
											{step.description}
										</p>
									</div>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section className="border-border/70 border-t">
					<div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8">
						<div className="flex min-h-[28rem] flex-col justify-between gap-12 rounded-[2rem] border border-border/70 bg-card p-7 sm:p-10">
							<div className="flex size-11 items-center justify-center rounded-full bg-muted">
								<Code2 aria-hidden="true" className="size-5" />
							</div>
							<div className="flex flex-col gap-4">
								<p className="text-muted-foreground text-sm">Install</p>
								<h2 className="font-medium text-3xl tracking-[-0.04em]">
									One command.
								</h2>
								<p className="max-w-md text-muted-foreground leading-7">
									Add the complete source through the shadcn CLI without adding
									a library wide runtime.
								</p>
								<InstallCommand compact />
							</div>
						</div>
						<div className="flex min-h-[28rem] flex-col justify-between gap-12 rounded-[2rem] border border-border/70 bg-card p-7 sm:p-10">
							<div className="flex size-11 items-center justify-center rounded-full bg-muted">
								<Layers3 aria-hidden="true" className="size-5" />
							</div>
							<div className="flex flex-col gap-4">
								<p className="text-muted-foreground text-sm">Your source</p>
								<h2 className="font-medium text-3xl tracking-[-0.04em]">
									Owned from day one.
								</h2>
								<p className="max-w-md text-muted-foreground leading-7">
									Read it, restyle it, version it, or take it apart. Every
									component lives in your repository.
								</p>
								<ul className="flex flex-col gap-2 text-sm">
									{["No call home", "Explicit updates", "Consumer themed"].map(
										(item) => (
											<li className="flex items-center gap-2" key={item}>
												<Check
													aria-hidden="true"
													className="size-4 text-ring"
												/>
												{item}
											</li>
										),
									)}
								</ul>
							</div>
						</div>
					</div>
				</section>

				<section className="border-border/70 border-t">
					<div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
						<SectionHeading eyebrow="FAQ" title="Good questions." />
						<div className="flex flex-col border-border/70 border-t">
							{questions.map((item) => (
								<details
									className="group border-border/70 border-b"
									key={item.question}
								>
									<summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-6 font-medium">
										{item.question}
										<span
											aria-hidden="true"
											className="text-muted-foreground group-open:rotate-45"
										>
											+
										</span>
									</summary>
									<p className="max-w-2xl pb-6 text-muted-foreground leading-7">
										{item.answer}
									</p>
								</details>
							))}
						</div>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}

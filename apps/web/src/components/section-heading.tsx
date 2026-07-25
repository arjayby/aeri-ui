import { cn } from "@aeri-ui/ui/lib/utils";

export function SectionHeading({
	align = "left",
	eyebrow,
	title,
	description,
}: {
	align?: "left" | "center";
	eyebrow: string;
	title: string;
	description?: string;
}) {
	return (
		<div
			className={cn(
				"flex max-w-2xl flex-col gap-4",
				align === "center" && "mx-auto items-center text-center",
			)}
		>
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
				{eyebrow}
			</p>
			<h2 className="text-balance font-medium text-3xl tracking-[-0.04em] sm:text-5xl">
				{title}
			</h2>
			{description ? (
				<p className="text-pretty text-base text-muted-foreground leading-7">
					{description}
				</p>
			) : null}
		</div>
	);
}

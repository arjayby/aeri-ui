export function ContentPageHeader({
	badge,
	badges,
	description,
	title,
}: {
	badge?: string;
	badges?: string[];
	description: string;
	title: string;
}) {
	const labels = badges ?? (badge ? [badge] : []);

	return (
		<header className="flex max-w-3xl flex-col gap-5">
			{labels.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{labels.map((label) => (
						<p
							className="w-fit rounded-full border border-border/70 px-3 py-1 font-medium text-muted-foreground text-xs"
							key={label}
						>
							{label}
						</p>
					))}
				</div>
			) : null}
			<h1 className="text-balance font-medium text-4xl tracking-[-0.045em] sm:text-6xl">
				{title}
			</h1>
			<p className="max-w-2xl text-pretty text-base text-muted-foreground leading-7 sm:text-lg">
				{description}
			</p>
		</header>
	);
}

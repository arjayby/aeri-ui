import Link from "next/link";

import type { CatalogLifecycle } from "@/lib/catalog";

export function PreviewInstallNotice({
	lifecycle,
}: {
	lifecycle: CatalogLifecycle;
}) {
	if (lifecycle !== "preview") {
		return null;
	}

	return (
		<div className="flex flex-col gap-1 text-sm">
			<p className="text-muted-foreground">
				Preview installation requires registry configuration until directory
				acceptance.
			</p>
			<Link
				className="w-fit text-foreground underline underline-offset-4"
				href="/docs/release-candidate"
			>
				View preview setup
			</Link>
		</div>
	);
}

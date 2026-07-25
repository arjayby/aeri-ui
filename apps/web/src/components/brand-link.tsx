import Link from "next/link";

import { AeriMark } from "./aeri-mark";

export function BrandLink({ compact = false }: { compact?: boolean }) {
	return (
		<Link
			aria-label="Aeri UI home"
			className="inline-flex items-center gap-2.5 font-medium text-[15px] tracking-tight"
			href="/"
		>
			<AeriMark />
			{compact ? null : <span>Aeri UI</span>}
		</Link>
	);
}

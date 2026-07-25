import { cn } from "@aeri-ui/ui/lib/utils";

export function AeriMark({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={cn("size-7", className)}
			fill="none"
			viewBox="0 0 32 32"
		>
			<path
				d="M5 11.5C9.2 7.2 14.5 6 21 8.1C24.1 9.1 26.1 8.7 28 7"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="2.25"
			/>
			<path
				d="M4 17C9.2 13.6 15 13.3 21.3 16.1C24.2 17.4 26.4 17.2 28.5 15.8"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="2.25"
			/>
			<path
				d="M6 22.8C10.2 20.6 14.6 20.5 19.3 22.8C22.1 24.2 24.6 24.4 27 23.3"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="2.25"
			/>
		</svg>
	);
}

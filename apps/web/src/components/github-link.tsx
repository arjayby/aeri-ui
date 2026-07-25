import { buttonVariants } from "@aeri-ui/ui/components/button";
import { cn } from "@aeri-ui/ui/lib/utils";
import { GitFork } from "lucide-react";

export function GithubLink() {
	return (
		<a
			aria-label="Aeri UI on GitHub"
			className={cn(
				buttonVariants({ size: "icon", variant: "ghost" }),
				"rounded-full",
			)}
			href="https://github.com/arjayby/aeri-ui"
			rel="noreferrer"
			target="_blank"
		>
			<GitFork aria-hidden="true" />
		</a>
	);
}

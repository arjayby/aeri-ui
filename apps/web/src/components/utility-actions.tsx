import { DocumentationSearch } from "./documentation-search";
import { GithubLink } from "./github-link";
import { ModeToggle } from "./mode-toggle";

export function UtilityActions() {
	return (
		<div className="flex items-center gap-0.5">
			<DocumentationSearch />
			<ModeToggle />
			<GithubLink />
		</div>
	);
}

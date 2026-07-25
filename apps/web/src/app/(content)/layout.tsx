import { DocumentationShell } from "@/components/documentation-shell";
import { SiteFooter } from "@/components/site-footer";

export default function ContentLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DocumentationShell>
			{children}
			<SiteFooter />
		</DocumentationShell>
	);
}

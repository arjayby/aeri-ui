import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";

const { rewrite: rewriteDocumentation } = rewritePath(
	"/docs{/*path}",
	"/llms.mdx/docs{/*path}/content.md",
);
const { rewrite: rewriteMarkdownSuffix } = rewritePath(
	"/docs{/*path}.md",
	"/llms.mdx/docs{/*path}/content.md",
);

export function proxy(request: NextRequest) {
	const suffixResult = rewriteMarkdownSuffix(request.nextUrl.pathname);
	if (suffixResult) {
		return NextResponse.rewrite(new URL(suffixResult, request.nextUrl));
	}

	if (isMarkdownPreferred(request)) {
		const documentationResult = rewriteDocumentation(request.nextUrl.pathname);
		if (documentationResult) {
			return NextResponse.rewrite(new URL(documentationResult, request.nextUrl));
		}
	}

	return NextResponse.next();
}

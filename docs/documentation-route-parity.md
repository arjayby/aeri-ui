# Documentation route parity

The unified Catalog at `https://aeriui.dev` is the canonical public destination for every route formerly served by the standalone Fumadocs application. The legacy application remains in the repository during migration, but it is not the public destination.

| Legacy route | Unified Catalog destination | Verification |
| --- | --- | --- |
| `/` | `/` | Catalog landing browser test |
| `/docs` | `/docs` | documentation browser test |
| `/docs/{path}` | `/docs/{path}` | documentation browser test |
| `/docs/{path}.md` | `/llms.mdx/docs/{path}/content.md` | machine readable response browser test |
| `/docs/{path}` with `Accept: text/markdown` | `/llms.mdx/docs/{path}/content.md` | machine readable response browser test |
| `/api/search?query=Hello` | `/api/search?query=Hello` | local search index browser test |
| `/llms.txt` | `/llms.txt` | machine readable response browser test |
| `/llms-full.txt` | `/llms-full.txt` | machine readable response browser test |
| `/llms.mdx/docs/content.md` | `/llms.mdx/docs/content.md` | machine readable response browser test |
| `/llms.mdx/docs/{path}/content.md` | `/llms.mdx/docs/{path}/content.md` | machine readable response browser test |
| `/og/docs/image.png` | `/og/docs/image.png` | machine readable response browser test |
| `/og/docs/test/image.png` | `/og/docs/test/image.png` | generated from the same shared route parameters |

Documentation metadata declares canonical `aeriui.dev` URLs and uses the unified Open Graph image route. Documentation search data and LLM oriented outputs are generated from the same Catalog source as the rendered pages.

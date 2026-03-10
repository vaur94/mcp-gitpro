# Tools

Turkce surum: [docs/tr/tools.md](../tr/tools.md)

`mcp-gitpro` exposes a compact 10-tool surface:

- `github_context`
- `repository_read`
- `repository_compare`
- `search_github`
- `issue_read`
- `issue_write`
- `pull_request_read`
- `pull_request_write`
- `actions_read`
- `actions_write`

## Behavior

- every tool returns text plus `structuredContent`
- read tools stay available in read-only mode
- write tools are removed when `context.readOnly=true`
- file, diff, and issue/PR body fields are capped before returning
- `actions_read` returns workflow metadata plus a log download URL, not inline log previews

Last updated: 2026-03-10

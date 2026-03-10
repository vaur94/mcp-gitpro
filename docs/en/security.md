# Security

Turkce surum: [docs/tr/security.md](../tr/security.md)

`mcp-gitpro` stays GitHub-API focused and keeps local shell, local git CLI, filesystem editing, and browser automation out of scope.

## Current controls

- token-based authentication via config or environment
- read-only mode that removes write tools and blocks write execution
- toolset allowlists and exact-tool allowlists
- output caps for issue/PR body text, file reads, and diffs
- actions logs stay out-of-band through GitHub download URLs instead of inline log payloads
- stdout reserved for MCP protocol traffic

## Out-of-scope product areas

- local shell execution
- local git CLI automation
- local filesystem mutation
- browser automation
- HTTP transport in v1

See also: [`../../SECURITY.md`](../../SECURITY.md) and [`../../.github/SECURITY.md`](../../.github/SECURITY.md).

Last updated: 2026-03-10

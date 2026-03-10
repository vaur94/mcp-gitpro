# Configuration

Turkce surum: [docs/tr/configuration.md](../tr/configuration.md)

`mcp-gitpro` reads configuration from `mcp-gitpro.config.json` and the `MCP_GITPRO_` environment prefix.

## Precedence

1. built-in defaults
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` environment values
4. CLI flags handled by `mcpbase`

## Main fields

- `auth.githubToken`
- `defaults.owner`
- `defaults.repo`
- `defaults.apiBaseUrl`
- `context.readOnly`
- `context.toolsets`
- `context.tools`
- `output.pageSize`, `output.maxFileLines`, `output.maxDiffLines`, `output.maxBodyChars`

## Practical defaults

- `pageSize`: `20`
- `maxFileLines`: `200`
- `maxDiffLines`: `200`
- `maxBodyChars`: `6000`

Last updated: 2026-03-10

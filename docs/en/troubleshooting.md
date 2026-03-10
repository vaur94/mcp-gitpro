# Troubleshooting

Turkce surum: [docs/tr/troubleshooting.md](../tr/troubleshooting.md)

## `GitHub token tanimli degil.`

The GitHub client rejects authenticated requests when `MCP_GITPRO_GITHUB_TOKEN` is missing. Set the token in the environment or provide `auth.githubToken` through config.

## A write tool is missing

If `context.readOnly` is `true`, write-capable tools are filtered out before registration. Check `mcp-gitpro.config.json` and any `MCP_GITPRO_READ_ONLY` override.

## A toolset is missing

The server filters tools by both `context.toolsets` and `context.tools`. Verify that the needed toolset or tool name is allowed.

## MCP output looks broken in the host

This project reserves stdout for MCP protocol traffic. Keep logs on stderr and avoid wrapping the server with extra stdout output.

Last updated: 2026-03-10

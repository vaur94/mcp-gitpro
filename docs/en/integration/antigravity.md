# Antigravity Integration

Antigravity configures local stdio MCP servers through an `mcpServers` JSON object. The most important detail is to use absolute executable paths because Antigravity may not inherit your interactive shell `PATH`.

## Recommended setup values

- command: `/absolute/path/to/node`
- args:
  1. `/absolute/path/to/mcp-gitpro/dist/index.js`
  2. `--config`
  3. `/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- env:
  - `MCP_GITPRO_GITHUB_TOKEN=...`

## Representative JSON example

If your Antigravity build exposes JSON-based MCP settings, the entry should look like this:

```json
{
  "mcpServers": {
    "mcp-gitpro": {
      "command": "/absolute/path/to/node",
      "args": [
        "/absolute/path/to/mcp-gitpro/dist/index.js",
        "--config",
        "/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json"
      ],
      "env": {
        "MCP_GITPRO_GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

## Notes

- Build the package before connecting.
- Keep stderr for logs and stdout for protocol traffic.
- Prefer explicit config paths during early setup.
- Use absolute executable paths for Node.js and any wrapper command you rely on.
- In shared workspaces, prefer `context.readOnly=true` until you explicitly need write actions.

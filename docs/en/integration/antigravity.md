# Antigravity Integration

Turkce surum: [docs/tr/integration/antigravity.md](../../tr/integration/antigravity.md)

Use this flow:

```bash
bash ./scripts/install-local.sh
```

Then add one `mcpServers` entry with absolute paths.

## Example

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

Use absolute paths for both Node.js and the config file. In shared workspaces, start with `context.readOnly=true`.

Last updated: 2026-03-10

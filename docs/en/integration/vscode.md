# VS Code Integration

Turkce surum: [docs/tr/integration/vscode.md](../../tr/integration/vscode.md)

Use this flow:

```bash
bash ./scripts/install-local.sh
```

Then add one MCP entry to `.vscode/mcp.json`.

## Example

```json
{
  "mcp": {
    "servers": {
      "mcp-gitpro": {
        "command": "node",
        "args": [
          "/absolute/path/to/mcp-gitpro/dist/index.js",
          "--config",
          "/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json"
        ],
        "env": {
          "MCP_GITPRO_GITHUB_TOKEN": "${input:github_token}"
        }
      }
    },
    "inputs": [
      {
        "type": "promptString",
        "id": "github_token",
        "description": "GitHub Personal Access Token",
        "password": true
      }
    ]
  }
}
```

Use absolute paths for `dist/index.js` and `mcp-gitpro.config.json`. If you only want safe inspection, start with `context.readOnly=true`.

Last updated: 2026-03-10

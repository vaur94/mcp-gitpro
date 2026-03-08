# VS Code Integration

VS Code MCP settings can point directly at the built stdio entry. The safest setup is to keep the token in an input prompt or external environment variable rather than hard-coding it into workspace files.

## Example `.vscode/mcp.json`

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

## Notes

- Run `npm run build` before connecting, and rebuild after TypeScript changes.
- Keep stdout reserved for protocol traffic; `mcp-gitpro` writes logs to stderr.
- Prefer absolute paths for both `dist/index.js` and `mcp-gitpro.config.json`.
- Use `context.readOnly=true` if you want repository inspection without write actions.

# VS Code Integration

Use the stdio server entry directly from the built package and pass the token through environment inputs.

```json
{
  "mcp": {
    "servers": {
      "mcp-gitpro": {
        "command": "node",
        "args": ["/full/path/dist/index.js", "--config", "/full/path/mcp-gitpro.config.json"],
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

Run `npm run build` before connecting, and keep stdout reserved for protocol traffic.

# VS Code Entegrasyonu

Bu akisla ilerleyin:

```bash
bash ./scripts/install-local.sh
```

Ardindan `.vscode/mcp.json` icine tek bir MCP girisi ekleyin.

## Ornek

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

`dist/index.js` ve `mcp-gitpro.config.json` icin absolute path kullanin. Yalnizca guvenli inceleme gerekiyorsa `context.readOnly=true` ile baslayin.

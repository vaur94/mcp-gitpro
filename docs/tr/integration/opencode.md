# OpenCode Entegrasyonu

Bu akisla ilerleyin:

```bash
bash ./scripts/install-local.sh
```

Ardindan `opencode.json` icine tek bir local MCP girisi ekleyin.

## Ornek

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp-gitpro": {
      "type": "local",
      "enabled": true,
      "command": [
        "node",
        "/absolute/path/to/mcp-gitpro/dist/index.js",
        "--config",
        "/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json"
      ],
      "environment": {
        "MCP_GITPRO_GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "timeout": 10000
    }
  }
}
```

Config yolunu absolute verin ve token'i `environment` uzerinden gecin. Yalnizca guvenli inceleme gerekiyorsa `context.readOnly=true` ile baslayin.

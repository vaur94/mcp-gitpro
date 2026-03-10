# Antigravity Entegrasyonu

English version: [docs/en/integration/antigravity.md](../../en/integration/antigravity.md)

Bu akisla ilerleyin:

```bash
bash ./scripts/install-local.sh
```

Ardindan absolute path kullanan tek bir `mcpServers` girisi ekleyin.

## Ornek

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

Hem Node.js executable'ini hem de config yolunu absolute verin. Paylasilan ortamlarda `context.readOnly=true` ile baslamak daha guvenlidir.

Son guncelleme: 2026-03-10

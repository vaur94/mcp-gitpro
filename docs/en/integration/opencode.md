# OpenCode Integration

Turkce surum: [docs/tr/integration/opencode.md](../../tr/integration/opencode.md)

Use this flow:

```bash
bash ./scripts/install-local.sh
```

Then add one local MCP entry to `opencode.json`.

## Example

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

Keep the config path absolute and pass the token through `environment`. If you only need safe inspection, set `context.readOnly=true` in `mcp-gitpro.config.json`.

Last updated: 2026-03-10

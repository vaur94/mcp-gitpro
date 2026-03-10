# Codex Entegrasyonu

English version: [docs/en/integration/codex.md](../../en/integration/codex.md)

Bu akisla ilerleyin:

```bash
bash ./scripts/install-local.sh
```

Ardindan `~/.codex/config.toml` veya `.codex/config.toml` icine tek bir sunucu girisi ekleyin.

## Ornek

```toml
[mcp_servers.mcp-gitpro]
command = "node"
args = [
  "/absolute/path/to/mcp-gitpro/dist/index.js",
  "--config",
  "/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json"
]
cwd = "/absolute/path/to/mcp-gitpro"
enabled = true
startup_timeout_sec = 20
tool_timeout_sec = 60
env = { MCP_GITPRO_GITHUB_TOKEN = "YOUR_GITHUB_TOKEN" }
```

`dist/index.js` ve `mcp-gitpro.config.json` icin absolute path kullanin. Guvenli inceleme gerekiyorsa `context.readOnly=true` ile baslayin.

Son guncelleme: 2026-03-10

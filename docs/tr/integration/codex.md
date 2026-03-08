# Codex Entegrasyonu

Codex, local stdio MCP sunucularini `~/.codex/config.toml` ve guvenilen proje klasorlerinde `.codex/config.toml` uzerinden destekler. `mcp-gitpro`, command, args, env ve istege bagli `cwd` ile tanimlanan standart local server sekline uyar.

## Secenek 1: Sunucuyu CLI ile ekleme

```bash
codex mcp add mcp-gitpro \
  --env MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN \
  -- node /absolute/path/to/mcp-gitpro/dist/index.js \
  --config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json
```

Codex'in sunucuyu gordugunu dogrulamak icin `codex mcp list` calistirin.

## Secenek 2: `config.toml` dosyasini dogrudan duzenleme

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

## Onerilen notlar

- Ilk kullanimdan once `npm run build` calistirin ki `dist/index.js` olussun.
- Token degerini `.codex/config.toml` icine commit etmek yerine kullanici seviyesi secret yonetimi veya lokal ortam degiskeni tercih edin.
- Codex, stdout'u MCP trafigi icin ayirir; `mcp-gitpro` loglari zaten stderr'e yollar.
- Sadece guvenli repo inceleme gerekiyorsa `mcp-gitpro.config.json` icinde `context.readOnly=true` kullanin.
- Proje-yerel Codex konfigurasyonunu yalnizca guvendiginiz repolarda `.codex/config.toml` ile acin.

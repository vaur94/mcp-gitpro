# Antigravity Entegrasyonu

Antigravity, local stdio MCP sunucularini `mcpServers` JSON nesnesi uzerinden tanimlar. En kritik nokta executable yollarini absolute vermektir; cunku Antigravity her zaman interaktif shell `PATH` degerini miras almayabilir.

## Onerilen kurulum degerleri

- command: `/absolute/path/to/node`
- args:
  1. `/absolute/path/to/mcp-gitpro/dist/index.js`
  2. `--config`
  3. `/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- env:
  - `MCP_GITPRO_GITHUB_TOKEN=...`

## Temsilci JSON ornegi

Antigravity surumunuz JSON tabanli MCP ayari sunuyorsa giris su sekilde olmalidir:

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

## Notlar

- Baglanmadan once paketi derleyin.
- Loglar icin stderr, protokol trafigi icin stdout kullanin.
- Ilk kurulumda acik config yolu tercih edin.
- Hem Node.js executable'ini hem de varsa wrapper komutlarini absolute path ile verin.
- Paylasilan ortamlarda yazma araclarini acmadan once `context.readOnly=true` ile baslamak daha guvenlidir.

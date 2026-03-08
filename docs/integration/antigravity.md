# Antigravity Entegrasyonu

Antigravity ayarinda diger MCP host'lari ile ayni stdio girisini ve acik konfigurasyon dosyasi yolunu kullanin.

```json
{
  "servers": {
    "mcp-gitpro": {
      "command": "node",
      "args": ["/full/path/dist/index.js", "--config", "/full/path/mcp-gitpro.config.json"],
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

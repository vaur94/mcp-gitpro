# OpenCode Entegrasyonu

OpenCode, local MCP sunucularini `opencode.json` dosyasinda `mcp` anahtari altinda, `type: "local"` ve command dizisi ile tanimlar. `mcp-gitpro` icin derlenmis stdio girisini ve GitHub token ortam degiskenini birlikte verin.

## On kosullar

1. `npm run build` veya `bash ./scripts/install-local.sh` ile projeyi derleyin.
2. `/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json` gibi acik bir config dosyasi yolu kullanin.
3. `MCP_GITPRO_GITHUB_TOKEN` degerini shell ortamindan veya OpenCode config'inden gecirin.

## Ornek `opencode.json`

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

## Notlar

- OpenCode sunucuyu local stdio process olarak baslatir; bu nedenle stdout MCP trafigine ayrilmali.
- `mcp-gitpro`, `mcpbase` uzerinden stderr'e log yazar; stdout'a ekstra cikti basan shell wrapper'lari kullanmayin.
- Paylasilan ortamlarda yalnizca okuma istiyorsaniz `mcp-gitpro.config.json` icinde `context.readOnly=true` ayarlayin.
- Gereksiz context tuketimini azaltmak icin tum araclari acmak yerine `context.toolsets` veya `context.tools` ile daraltma yapin.

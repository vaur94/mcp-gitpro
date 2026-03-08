# VS Code Entegrasyonu

VS Code MCP ayarlari derlenmis stdio girisini dogrudan kullanabilir. En guvenli kurulum, token'i workspace dosyasina gommek yerine input prompt veya harici ortam degiskeni uzerinden gecirmektir.

## Ornek `.vscode/mcp.json`

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

## Notlar

- Baglanmadan once `npm run build` calistirin; TypeScript degisikliginden sonra yeniden derleyin.
- stdout sadece protokol trafigine ayrilmali; `mcp-gitpro` loglari stderr'e yazar.
- Hem `dist/index.js` hem de `mcp-gitpro.config.json` icin absolute path kullanin.
- Sadece repo inceleme istiyorsaniz `context.readOnly=true` ile baslayin.

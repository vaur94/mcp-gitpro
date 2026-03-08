# VS Code Entegrasyonu

Derlenmis paket giris noktasini stdio sunucusu olarak dogrudan kullanin.

```json
{
  "mcp": {
    "servers": {
      "mcp-gitpro": {
        "command": "node",
        "args": ["/full/path/dist/index.js", "--config", "/full/path/mcp-gitpro.config.json"]
      }
    }
  }
}
```

Ek stdout ciktilarini protokol kanali ile karistirmayin.

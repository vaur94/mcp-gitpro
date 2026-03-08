# OpenCode Entegrasyonu

`mcp-gitpro` sunucusunu derlenmis `dist/index.js` giris noktasindan stdio sunucusu olarak tanimlayin.

```json
{
  "mcpServers": {
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

stdout yalnizca MCP protokolu icin ayrilmalidir. Paylasilan ortamlarda gerekirse `context.readOnly=true` kullanin.

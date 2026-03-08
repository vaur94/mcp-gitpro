# OpenCode Integration

Configure `mcp-gitpro` as a stdio server from the built `dist/index.js` entry point.

```json
{
  "mcpServers": {
    "mcp-gitpro": {
      "command": "node",
      "args": ["/full/path/dist/index.js", "--config", "/full/path/mcp-gitpro.config.json"]
    }
  }
}
```

Keep stdout reserved for the MCP protocol.

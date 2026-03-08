# OpenCode Integration

OpenCode documents local MCP servers under the `mcp` key in `opencode.json`, with `type: "local"` and a command array. For `mcp-gitpro`, point OpenCode at the built stdio entry and pass the GitHub token through `environment`.

## Prerequisites

1. Build the project with `npm run build` or `bash ./scripts/install-local.sh`.
2. Keep an explicit config file at `/absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`.
3. Provide `MCP_GITPRO_GITHUB_TOKEN` from your shell or OpenCode config.

## Example `opencode.json`

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

## Notes

- OpenCode starts the server as a local stdio process, so stdout must stay reserved for MCP traffic.
- `mcp-gitpro` already logs to stderr through `mcpbase`; do not wrap it with shell helpers that print to stdout.
- If you only want discovery and read operations in shared environments, set `context.readOnly` to `true` in `mcp-gitpro.config.json`.
- To reduce context pressure, limit `context.toolsets` or `context.tools` instead of exposing every tool by default.

# Codex Integration

Turkce surum: [docs/tr/integration/codex.md](../../tr/integration/codex.md)

Use this flow:

```bash
bash ./scripts/install-local.sh
```

Then add one server entry to `~/.codex/config.toml` or `.codex/config.toml`.

## Example

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

Use absolute paths for `dist/index.js` and `mcp-gitpro.config.json`. For safer repo inspection, start with `context.readOnly=true`.

Last updated: 2026-03-10

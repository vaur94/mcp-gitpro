# Codex Integration

Codex supports local stdio MCP servers from `~/.codex/config.toml` and trusted project-scoped `.codex/config.toml` files. `mcp-gitpro` fits the standard local server shape: command, args, env, and an optional working directory.

## Option 1: Add the server from the CLI

```bash
codex mcp add mcp-gitpro \
  --env MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN \
  -- node /absolute/path/to/mcp-gitpro/dist/index.js \
  --config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json
```

Use `codex mcp list` to verify that Codex sees the server.

## Option 2: Edit `config.toml` directly

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

## Recommended notes

- Run `npm run build` before first use so the `dist/index.js` entry exists.
- Prefer a user-level token source or local secret manager instead of committing token values into `.codex/config.toml`.
- Codex reserves stdout for MCP traffic; `mcp-gitpro` already logs to stderr.
- If you only need safe repository inspection, set `context.readOnly=true` in `mcp-gitpro.config.json`.
- For project-local Codex config, use `.codex/config.toml` only in trusted repositories.

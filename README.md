# mcp-gitpro

🇬🇧 English | [🇹🇷 Turkce](./README.tr.md)

> ✨ A production-ready, stdio-first GitHub MCP server built on `@vaur94/mcpbase`.

`mcp-gitpro` gives AI agents a compact GitHub tool surface without drifting into local git, filesystem mutation, shell execution, or browser automation. The goal is simple: high-value GitHub workflows, low context waste, and clear safety boundaries.

## ✨ Why mcp-gitpro

- GitHub-focused tool surface for repositories, issues, pull requests, search, and Actions
- Read-only mode, toolset allowlists, and exact-tool allowlists to reduce token waste
- Strict TypeScript, stdio-first runtime, protocol tests, and release automation
- Bilingual documentation with clearly separated English and Turkish doc trees
- Built on the published `@vaur94/mcpbase` package instead of a local fork

## 📦 Installation

- Node.js `>=22.14.0`
- npm `>=10`
- A GitHub token available as `MCP_GITPRO_GITHUB_TOKEN`

The setup below is for a local checkout of this repository.

Preferred repo-local setup:

```bash
bash ./scripts/install-local.sh
```

This installs dependencies, builds the server, and runs `npm test` once.

## ⚡ Quick Start

The commands below assume you are running from a clone of this repository, where `scripts/install-local.sh` and `mcp-gitpro.config.json` are available.

1. Install and build once:

```bash
bash ./scripts/install-local.sh
```

2. Launch the local stdio server:

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

3. Optional pre-host verification:

```bash
npm run ci:check
```

Common host values:

- launcher: `node`
- entrypoint: `/absolute/path/to/mcp-gitpro/dist/index.js`
- config flag: `--config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- token: `MCP_GITPRO_GITHUB_TOKEN=...`
- protocol rule: stdout is reserved for MCP; logs belong on stderr

## 🔌 Integration Guides

Each guide follows the same pattern:

1. run `bash ./scripts/install-local.sh`
2. point the host to `dist/index.js`
3. pass `--config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
4. provide `MCP_GITPRO_GITHUB_TOKEN`

| Host            | Integration model                                      | Guide                                               |
| --------------- | ------------------------------------------------------ | --------------------------------------------------- |
| OpenCode        | `opencode.json` local MCP entry with command array     | [OpenCode](./docs/en/integration/opencode.md)       |
| Codex CLI / IDE | `config.toml` with `[mcp_servers.<name>]`              | [Codex](./docs/en/integration/codex.md)             |
| VS Code         | workspace MCP JSON with `command`, `args`, and `env`   | [VS Code](./docs/en/integration/vscode.md)          |
| Antigravity     | `mcpServers` JSON entry with absolute executable paths | [Antigravity](./docs/en/integration/antigravity.md) |

## 🧰 Tool Surface

### Toolsets

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

### Tools

- `github_context`
- `repository_read`
- `repository_compare`
- `search_github`
- `issue_read`
- `issue_write`
- `pull_request_read`
- `pull_request_write`
- `actions_read`
- `actions_write`

## ⚙️ Configuration

Configuration precedence:

1. built-in defaults
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` environment variables
4. CLI flags handled by `mcpbase`

Important fields:

- `auth.githubToken`
- `defaults.owner`
- `defaults.repo`
- `defaults.apiBaseUrl`
- `context.readOnly`
- `context.toolsets`
- `context.tools`
- `output.pageSize`
- `output.maxFileLines`
- `output.maxDiffLines`
- `output.maxBodyChars`

## 🏗️ Project Shape

```text
mcp-gitpro/
|- src/
|  |- config/
|  |- core/
|  |- github/
|  |- shared/
|  |- tools/
|- tests/
|  |- unit/
|  |- protocol/
|- docs/
|  |- en/
|  |- tr/
|- scripts/
```

## 🔗 mcpbase Integration

- `mcp-gitpro` depends on the published `@vaur94/mcpbase` package from npm
- startup is wired with `ApplicationRuntime`, `createMcpServer`, and `startStdioServer`
- config loading extends `mcpbase` through `createRuntimeConfigSchema` and `loadConfig`
- execution context extends `BaseToolExecutionContext` with `GitHubClient`
- streamable HTTP and telemetry remain intentionally unused in this GitHub-specific stdio product

## 📚 Documentation

- English docs index: [`docs/en/index.md`](./docs/en/index.md)
- Turkish docs index: [`docs/tr/index.md`](./docs/tr/index.md)
- Quick start: [`docs/en/quick-start.md`](./docs/en/quick-start.md)
- Usage: [`docs/en/usage.md`](./docs/en/usage.md)
- English configuration: [`docs/en/configuration.md`](./docs/en/configuration.md)
- Turkish configuration: [`docs/tr/configuration.md`](./docs/tr/configuration.md)
- Security policy: [`SECURITY.md`](./SECURITY.md)
- Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Support: [`SUPPORT.md`](./SUPPORT.md)

## 🧪 Quality Gates

```bash
npm run build
npm run typecheck
npm run test
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## 🛡️ Scope and Non-goals

This repository intentionally excludes:

- local git CLI workflows
- filesystem editing or patch application
- shell execution
- browser automation
- HTTP transport in v1

Security controls include token-based auth, read-only mode, tool allowlists, output caps, and out-of-band Actions log delivery.

## 📄 License

MIT - see [`LICENSE`](./LICENSE).

Last updated: 2026-03-10

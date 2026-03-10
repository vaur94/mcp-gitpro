# Quick Start

Turkce surum: [docs/tr/quick-start.md](../tr/quick-start.md)

Use this path when running the repository locally.

## Prerequisites

- Node.js `>=22.14.0`
- npm `>=10`
- A GitHub token exposed as `MCP_GITPRO_GITHUB_TOKEN`

## Local setup

```bash
bash ./scripts/install-local.sh
```

The install script installs dependencies, builds the project, and runs the test suite.

## Start the stdio server

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

## Host-side values

- command: `node`
- entrypoint: `/absolute/path/to/mcp-gitpro/dist/index.js`
- config argument: `--config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- token env: `MCP_GITPRO_GITHUB_TOKEN`

## Next reads

- [Installation](./installation.md)
- [Usage](./usage.md)
- [Configuration](./configuration.md)

Last updated: 2026-03-10

#!/usr/bin/env bash

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if ! command -v node >/dev/null 2>&1; then
  printf 'node is required but was not found in PATH.\n' >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf 'npm is required but was not found in PATH.\n' >&2
  exit 1
fi

printf 'Installing dependencies...\n'
npm --prefix "$ROOT_DIR" install

printf 'Building mcp-gitpro...\n'
npm --prefix "$ROOT_DIR" run build

printf 'Running tests...\n'
npm --prefix "$ROOT_DIR" test

printf '\nDone. Next steps:\n'
printf '1. Set MCP_GITPRO_GITHUB_TOKEN in your shell or host config.\n'
printf '2. Copy mcp-gitpro.config.json and adjust defaults if needed.\n'
printf '3. Point your MCP host at %s/dist/index.js\n' "$ROOT_DIR"

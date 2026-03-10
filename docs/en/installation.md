# Installation

Turkce surum: [docs/tr/installation.md](../tr/installation.md)

## Verified installation path

The repository ships a local setup script at `scripts/install-local.sh`.

```bash
bash ./scripts/install-local.sh
```

The script performs these steps:

1. checks that `node` is available
2. checks that `npm` is available
3. runs `npm install`
4. runs `npm run build`
5. runs `npm test`

## Manual equivalent

```bash
npm install
npm run build
npm test
```

## Published package notes

`package.json` declares a public package and exposes the `mcp-gitpro` CLI through `bin/cli.js`. The repository's documented setup flow remains the local script above because it is fully verifiable from this codebase.

Last updated: 2026-03-10

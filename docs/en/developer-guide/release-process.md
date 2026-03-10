# Release Process

Turkce surum: [docs/tr/developer-guide/release-process.md](../../tr/developer-guide/release-process.md)

## Flow

1. Conventional commits are analyzed by `release-it` with the conventional changelog plugin.
2. The `main` branch remains the release branch.
3. GitHub Actions runs `npm run ci:check`.
4. A green push to `main` can bump the version, update `CHANGELOG.md`, create the Git tag, create the GitHub release, and publish to npm with trusted publishing.

## Required environment

- `GITHUB_TOKEN`
- npm trusted publishing configured for `vaur94/mcp-gitpro` and `ci.yml`

The release job needs `id-token: write`, full git history, and the npm trusted publisher mapping to stay token-free.

## Known-good baseline

- `release-it` is the active release tool.
- The release workflow ignores pushes whose head commit starts with `chore(release):` to avoid self-triggered publish loops.
- `package.json` currently advertises `1.0.2`, while some runtime/config literals still read `0.1.0` in `mcp-gitpro.config.json`, `src/config/default-config.ts`, and `src/github/client.ts`.
- GitHub Actions uses the bot identity environment variables in the release step so release commits and tags can be created without interactive git setup.

Last updated: 2026-03-10

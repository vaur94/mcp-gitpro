# Release Process

## Flow

1. Conventional commits are analyzed by `release-it` with the conventional changelog plugin.
2. The `main` branch remains the release branch.
3. GitHub Actions runs `npm run ci:check`.
4. A green push to `main` can bump the version, update `CHANGELOG.md`, create the Git tag, create the GitHub release, and publish to npm with trusted publishing.

## Required environment

- `GITHUB_TOKEN`
- npm trusted publishing configured for `vaur94/mcp-gitpro` and `ci.yml`

The release job needs `id-token: write`, full git history, and the npm trusted publisher mapping to stay token-free.

# Release Process

## Flow

1. Conventional commits are analyzed by `semantic-release`.
2. The `main` branch remains the release branch.
3. GitHub Actions runs `npm run ci:check`.
4. When `NPM_TOKEN` is configured, a green push to `main` can publish changelog, GitHub release data, and npm metadata.

## Required secrets

- `GITHUB_TOKEN`
- `NPM_TOKEN`

Without `NPM_TOKEN`, the release job is skipped so quality CI can stay green on a fresh repository.

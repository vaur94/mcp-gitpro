# PR and Branching

Turkce surum: [docs/tr/pr-and-branching.md](../tr/pr-and-branching.md)

## Verified facts

- The default release branch is `main`.
- Pull requests trigger the quality workflow in `.github/workflows/ci.yml`.
- Pushes to `main` can trigger automated release work when the quality job passes.
- Release commits use the `chore(release): v${version}` format in `.release-it.json`.

## Proposed defaults

The repository does not publish strict contributor branch rules yet. Until that changes, these defaults fit the current workflow:

- branch names such as `docs/...`, `fix/...`, `feat/...`, or `chore/...`
- pull requests that include the exact verification command used
- conventional commit style when practical because changelog generation uses the conventional changelog plugin

## Before opening a PR

- run `npm run ci:check`
- update English and Turkish docs when user-visible behavior changes
- confirm scope stays inside the documented product boundaries

Last updated: 2026-03-10

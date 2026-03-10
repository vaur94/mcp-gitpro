# Release Process

Turkce surum: [docs/tr/developer-guide/release-process.md](../../tr/developer-guide/release-process.md)

## Flow

1. A maintainer prepares version and changelog updates in a normal branch and opens a PR.
2. `main` remains the publish branch, but release metadata must reach it through PR merge rather than a workflow push.
3. GitHub Actions runs `npm run ci:check` on the merged commit.
4. The publish job runs `npm pack --dry-run`, compares `package.json` against the live npm version, and publishes only when the merged version is newer than npm.
5. After a publish, the workflow creates the matching GitHub release and tag from the merged commit without writing a release commit back to `main`.
6. If npm already has the package version but GitHub release metadata is missing, the workflow stops and requires manual reconciliation instead of creating a potentially incorrect tag or release on a newer commit.

## Required environment

- `GITHUB_TOKEN`
- npm trusted publishing configured for `vaur94/mcp-gitpro` and `ci.yml`

The publish job needs `id-token: write`, full git history, and the npm trusted publisher mapping to stay token-free.

## Known-good baseline

- `release-it` is now a local PR-preparation helper, not the CI publisher.
- CI no longer pushes release commits back to `main`.
- GitHub Actions publishes from the already-merged commit and creates the GitHub release/tag from that commit.
- The publish job skips when `package.json` is older than the live npm version, which prevents replaying a stale version after a partial release.
- The publish job also skips when npm already has the current package version but GitHub release metadata is missing; that state must be reconciled manually.
- The publish job uses workflow concurrency so two fast pushes to `main` do not race to publish the same version.
- `package.json` currently advertises `1.0.3`, while some runtime/config literals still read `0.1.0` in `mcp-gitpro.config.json`, `src/config/default-config.ts`, and `src/github/client.ts`.

## Local release preparation

If you want help drafting a release PR locally, `npm run release` can still prepare the version bump and changelog on your current branch. It no longer publishes to npm, creates a GitHub release, creates a tag, or pushes to the remote.

Run it only on a clean branch that you intend to turn into a PR, because the helper still writes local version and changelog changes.

Last updated: 2026-03-10

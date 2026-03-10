# Contributing

Turkce surum: [CONTRIBUTING.tr.md](./CONTRIBUTING.tr.md)

`mcp-gitpro` is a GitHub-focused stdio MCP server with a deliberately small product surface. Contributions should keep the project aligned with its current boundaries: no local git CLI workflows, no filesystem editing, no shell execution, no browser automation, and no HTTP transport in v1.

## Before you change code

1. Read `AGENTS.md` and `src/AGENTS.md` for repository-specific constraints.
2. Install dependencies and build the project:

```bash
bash ./scripts/install-local.sh
```

3. If you change code, run the full quality gate before opening a pull request:

```bash
npm run ci:check
```

## What to update with every change

- Tests for behavior changes in `tests/unit/` or `tests/protocol/`
- Documentation when tool behavior, setup, configuration, or release guidance changes
- User-facing text in Turkish when runtime messages or MCP output text changes

## Verified repository expectations

- The project is ESM-only and uses `.js` extensions in TypeScript imports.
- Runtime and user-facing text stays in Turkish.
- CI runs formatting, linting, typechecking, unit coverage, build, and protocol tests through `npm run ci:check`.
- Releases are automated from `main` through GitHub Actions and `release-it`.

## Proposed defaults

The repository does not currently document enforced branch naming rules. Until maintainers publish stricter rules, these are safe defaults:

- Branch names: `docs/...`, `fix/...`, `feat/...`, `chore/...`
- Commit messages: conventional commit style where practical, because changelog generation uses the conventional changelog plugin
- Pull requests: include scope, verification steps, and documentation impact

## Pull request checklist

- Scope stays inside the documented product boundaries
- Related docs are updated in English and Turkish where needed
- `npm run ci:check` passes locally
- New behavior is backed by tests or an explicit rationale for why tests were not needed
- Security-sensitive issues are not disclosed publicly in the PR description

Last updated: 2026-03-10

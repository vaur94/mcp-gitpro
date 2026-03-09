---
name: npm-trusted-publish
description: Publish npm packages safely with npm trusted publishing, GitHub Actions, and release-it. Use when setting up first publish, fixing OIDC publish failures, or documenting a repeatable npm release workflow.
---

# npm Trusted Publish

Use this skill when you need to set up or maintain an npm package release flow that:

- publishes to npm without long-lived `NPM_TOKEN` secrets
- uses GitHub Actions with `id-token: write`
- creates GitHub releases from CI
- handles first publish, trusted publisher setup, and common OIDC failures

This skill is optimized for single-package Node repositories using:

- `npm`
- GitHub Actions
- npm trusted publishing
- `release-it`

## What this skill helps with

Use it for these jobs:

1. First-time npm package publish
2. npm trusted publisher setup
3. GitHub Actions release workflow setup
4. `release-it`-based automated npm publishing
5. Fixing common failures like:
   - `ENONPMTOKEN`
   - `EOTP`
   - invalid workflow/repo mapping
   - release loop on `chore(release):` commits
   - missing git author identity in CI
   - npm publish warnings caused by invalid `bin` paths

## Required baseline

Before using this workflow, make sure the repo has:

- a valid `package.json`
- a public npm package name
- a GitHub repository connected to the package metadata
- GitHub Actions enabled

Recommended `package.json` metadata:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/OWNER/REPO.git"
  },
  "bugs": {
    "url": "https://github.com/OWNER/REPO/issues"
  },
  "homepage": "https://github.com/OWNER/REPO#readme",
  "publishConfig": {
    "access": "public"
  }
}
```

If the package exposes a CLI, the `bin` value should not start with `./`.

Correct:

```json
{
  "bin": {
    "my-cli": "bin/cli.js"
  }
}
```

## First publish flow

If the package does not exist on npm yet, trusted publishing alone is not enough.

Do this first:

```bash
npm whoami
npm publish --access public --otp=YOUR_OTP
npm view YOUR_PACKAGE version name repository homepage --json
```

Notes:

- First publish may require OTP / 2FA.
- After the first successful publish, configure trusted publishing on npm.
- If `npm view YOUR_PACKAGE` returns `404`, the package still does not exist.

## npm trusted publisher setup

Create the trusted publisher mapping on npm after the first publish.

Correct mapping values:

- owner/user: GitHub account or org name
- repository: repository name only
- workflow filename: file name only, not full path
- environment: leave empty unless the workflow explicitly uses `environment:`

Example:

- owner: `vaur94`
- repo: `mcp-gitpro`
- workflow file: `ci.yml`
- environment: empty

Important:

- npm expects only `ci.yml`, not `.github/workflows/ci.yml`
- a `409 Conflict` from `npm trust github ...` usually means a trusted publisher already exists

Useful commands:

```bash
npx -y npm@11.11.0 trust github YOUR_PACKAGE --repo OWNER/REPO --file ci.yml
npx -y npm@11.11.0 trust list YOUR_PACKAGE --json
```

## Recommended GitHub Actions release job

Use a release job with:

- `contents: write`
- `id-token: write`
- full git history
- bot author identity in the release step

Example:

```yaml
release:
  name: Release
  needs: quality
  if: github.event_name == 'push' && github.ref == 'refs/heads/main' && !startsWith(github.event.head_commit.message, 'chore(release):')
  runs-on: ubuntu-latest
  permissions:
    contents: write
    issues: write
    pull-requests: write
    id-token: write
  steps:
    - name: Check out repository
      uses: actions/checkout@v6
      with:
        fetch-depth: 0

    - name: Set up Node.js
      uses: actions/setup-node@v6
      with:
        node-version: 24
        cache: npm
        registry-url: https://registry.npmjs.org

    - name: Install dependencies
      run: npm ci

    - name: Run release-it
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        GIT_AUTHOR_NAME: github-actions[bot]
        GIT_AUTHOR_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
        GIT_COMMITTER_NAME: github-actions[bot]
        GIT_COMMITTER_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
      run: npm run release -- --ci
```

Why these details matter:

- `id-token: write` is required for npm OIDC trusted publishing
- `fetch-depth: 0` is needed for tags/history-based release tooling
- release commits must not re-trigger release endlessly
- GitHub runner does not always have a usable git author identity for automated release commits

## Recommended release-it config

Use `release-it` with conventional changelog and npm publish via provenance.

Minimal example:

```json
{
  "$schema": "https://unpkg.com/release-it@19/schema/release-it.json",
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  },
  "git": {
    "requireBranch": "main",
    "commitMessage": "chore(release): v${version}",
    "tagName": "v${version}",
    "push": true
  },
  "npm": {
    "ignoreVersion": true,
    "publish": true,
    "skipChecks": true,
    "publishArgs": ["--provenance", "--access", "public"]
  },
  "github": {
    "release": true,
    "releaseName": "v${version}"
  }
}
```

Why these options matter:

- `skipChecks` avoids local `npm ping` / `npm whoami` prechecks that are not useful in trusted publishing CI
- `ignoreVersion` helps when git tags are the real release baseline and `package.json` may lag behind
- `publishArgs` ensures provenance and public publish behavior

## Release scripts

Recommended `package.json` script:

```json
{
  "scripts": {
    "release": "release-it"
  }
}
```

Useful local verification:

```bash
npm run release -- --ci --dry-run --no-git.requireCleanWorkingDir --github.skipChecks
```

This is useful for checking:

- next version calculation
- changelog generation
- tag naming
- publish command shape

## Common failure patterns and fixes

### `ENONPMTOKEN No npm token specified`

Meaning:

- trusted publishing did not activate
- the workflow is still using a legacy token path
- or the npm trusted publisher mapping is wrong

Check:

1. `id-token: write` exists in workflow permissions
2. trusted publisher points to correct owner/repo/workflow file
3. workflow filename is only `ci.yml`
4. environment is empty unless workflow uses `environment:`

### `EOTP`

Meaning:

- first manual publish still depends on OTP

Fix:

- complete the first publish manually with OTP
- then switch subsequent publishes to trusted publishing

### Git author identity unknown

Meaning:

- CI tried to create a release commit/tag without author identity

Fix:

- set `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, `GIT_COMMITTER_EMAIL` in the release step env

### Publish loop after release commit

Meaning:

- the workflow is triggered again by its own `chore(release): ...` push

Fix:

- guard the release job with:

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main' && !startsWith(github.event.head_commit.message, 'chore(release):')
```

### npm publish warns about invalid `bin`

Meaning:

- `bin` path is malformed in `package.json`

Fix:

- use `bin/cli.js`, not `./bin/cli.js`

### Package already published

Example error:

```text
You cannot publish over the previously published versions: 1.0.1.
```

Meaning:

- npm publish already succeeded, but the rest of the release flow failed later

Recovery:

1. align `package.json` and `package-lock.json` with the published version
2. create the missing git tag
3. create the missing GitHub release
4. guard the workflow so release commits do not republish the same version

## Verification checklist

After setup or repair, verify all of these:

```bash
npm audit --json
npm run ci:check
npm view YOUR_PACKAGE version --json
gh run list --workflow ci.yml --limit 5 --repo OWNER/REPO
gh release list --repo OWNER/REPO --limit 5
gh api repos/OWNER/REPO/dependabot/alerts?state=open
git status -sb
```

Healthy target state:

- `npm audit` shows `0 vulnerabilities`
- main workflow is green
- npm package version matches repo release state
- GitHub release exists for the same tag/version
- open Dependabot alerts are empty or understood
- working tree is clean

## When to use this skill in practice

Trigger this skill when the user asks things like:

- "npm package yayın akışını kur"
- "trusted publishing ayarla"
- "NPM_TOKEN olmadan publish nasıl yapılır"
- "ENONPMTOKEN neden oluyor"
- "ilk npm publish nasıl yapılır"
- "release-it ile npm publish akışı kur"
- "GitHub Actions npm publish fail veriyor"

## Final rule of thumb

For modern npm package automation:

- first publish manually if the package does not exist yet
- all later publishes should use npm trusted publishing
- use GitHub Actions OIDC, not long-lived npm tokens
- keep release tooling narrow and observable
- verify npm, GitHub release, workflow status, and security state together

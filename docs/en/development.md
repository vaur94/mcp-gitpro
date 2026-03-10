# Development

Turkce surum: [docs/tr/development.md](../tr/development.md)

## Local workflow

Use the install script for first-time setup:

```bash
bash ./scripts/install-local.sh
```

During active work, the key commands come from `package.json`:

- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run test:coverage`
- `npm run test:protocol`
- `npm run ci:check`

## Where to work

- `src/` for runtime, config, GitHub client behavior, and tools
- `tests/` for unit and protocol coverage
- `docs/` for bilingual project docs and host integration guides
- `.github/workflows/ci.yml` for quality and release automation

## Detailed guides

- [Local development detail](./developer-guide/local-development.md)
- [Release process detail](./developer-guide/release-process.md)

Last updated: 2026-03-10

# Testing

Turkce surum: [docs/tr/testing.md](../tr/testing.md)

## Commands

- `npm run test` runs unit and protocol tests
- `npm run test:unit` runs unit tests only
- `npm run test:protocol` builds first, then runs protocol tests
- `npm run test:coverage` runs unit tests with coverage
- `npm run ci:check` runs formatting, linting, typechecking, unit coverage, build, and protocol tests

## What the tests verify

- config loading from file and environment overrides
- tool filtering for read-only mode and allowlists
- GitHub client auth, error surfacing, and clamping behavior
- protocol-level tool registration and error handling over stdio

## Notes

- Protocol tests use the built `dist/index.js` entrypoint.
- Unit tests mock GitHub behavior instead of calling the live API.

Last updated: 2026-03-10

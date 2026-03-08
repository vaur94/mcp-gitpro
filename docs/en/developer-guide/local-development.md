# Local Development

## Setup

1. `npm install`
2. `npm run build`
3. `npm test`
4. `npm run ci:check`

## Important Files

- `package.json`: scripts and package identity
- `tsconfig.json`: strict TypeScript settings
- `tsup.config.ts`: ESM build output
- `vitest.config.ts`: test and coverage rules
- `mcp-gitpro.config.json`: local config example

## Notes

- Protocol tests use the built `dist/index.js` entrypoint.
- Unit tests mock GitHub behavior and do not require live API access.

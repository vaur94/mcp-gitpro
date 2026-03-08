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

## mcpbase Usage

- The runtime is built on the published `@vaur94/mcpbase` package; this repository does not fork or vendor the base framework.
- `src/index.ts` wires `ApplicationRuntime`, `StderrLogger`, `createMcpServer`, and `startStdioServer` directly for stdio-first startup.
- `src/config/schema.ts` and `src/config/load-config.ts` extend the `mcpbase` config chain through `createRuntimeConfigSchema` and `loadConfig`.
- `src/context.ts` extends `BaseToolExecutionContext` with the GitHub-specific `GitHubClient`.
- Tool allowlisting and read-only filtering are implemented locally in `src/core/tool-filtering.ts`; streamable HTTP and telemetry remain intentionally unused for this product scope.

## Notes

- Protocol tests use the built `dist/index.js` entrypoint.
- Unit tests mock GitHub behavior and do not require live API access.

# PROJECT KNOWLEDGE BASE

Generated: 2026-03-08T04:53:34Z
Commit: d6d4152
Branch: main

## OVERVIEW

GitHub-focused stdio MCP server built on `@vaur94/mcpbase`. Small tool surface, strict TypeScript, bilingual docs, and CI/release wiring are all first-class.

## STRUCTURE

```text
mcp-gitpro/
|- src/                 # runtime, config, GitHub client, tool implementations
|- tests/               # unit + protocol coverage
|- docs/                # English/Turkish docs and IDE integration guides
|- .github/             # CI, release, Dependabot, Copilot rules
|- bin/cli.js           # published CLI entrypoint
|- mcp-gitpro.config.json
|- package.json
```

## WHERE TO LOOK

| Task                  | Location                                | Notes                                        |
| --------------------- | --------------------------------------- | -------------------------------------------- |
| Bootstrap or exports  | `src/index.ts`                          | stdio startup and public exports live here   |
| Tool inventory        | `src/tools/index.ts`                    | central registry and filtering entry         |
| Runtime config        | `src/config/`                           | schema, defaults, env/file loading           |
| GitHub HTTP behavior  | `src/github/client.ts`                  | auth, JSON/text requests, truncation helpers |
| Security boundaries   | `docs/security.md`, `README.md`         | repo non-goals are explicit                  |
| Protocol validation   | `tests/protocol/stdio.protocol.test.ts` | validates built server over stdio            |
| Broad behavior checks | `tests/unit/tool-execution.test.ts`     | main mocked coverage of tool paths           |
| CI/release behavior   | `.github/workflows/ci.yml`              | quality gate + conditional release           |

## CONVENTIONS

- ESM only; use `.js` extensions in TypeScript imports.
- Runtime and user-facing text stays in Turkish.
- Prefer short tool descriptions and structured MCP outputs.
- Keep changes aligned with `mcpbase` package shape: `tsup`, Vitest, semantic-release, docs split under `docs/` and `docs/en/`.
- Coverage thresholds matter: lines/functions/statements 90, branches 80.

## ANTI-PATTERNS (THIS PROJECT)

- Never add local filesystem editing, local git CLI, shell execution, or browser automation.
- Do not expand into `mcp-fileops` scope such as patch application, file writes, or directory manipulation.
- Do not add HTTP transport behavior in v1.
- Do not replace mocked GitHub testing with live API calls in CI.

## UNIQUE STYLES

- Tool surface is intentionally compact: prefer strengthening existing GitHub tools over adding broad low-value endpoints.
- Read-only mode and tool/toolset allowlists are part of the product contract, not optional polish.
- Release workflow must stay green even when `NPM_TOKEN` is absent; publish should skip cleanly rather than fail the repo.

## COMMANDS

```bash
npm run build
npm run typecheck
npm run test
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## NOTES

- `src/` is the only child area complex enough to warrant its own `AGENTS.md`.
- `tests/`, `docs/`, and `.github/` are important but still small; cover them from this root file unless they grow substantially.
- `bin/cli.js` must remain included in the published package.

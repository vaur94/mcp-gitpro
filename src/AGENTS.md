# SOURCE GUIDE

## OVERVIEW

`src/` contains the runtime contract: config loading, GitHub client behavior, tool registration, and all MCP tool implementations.

## STRUCTURE

```text
src/
|- config/             # schema, defaults, env/file loading
|- core/               # tool filtering and shared runtime policies
|- github/             # GitHub HTTP client and repo resolution
|- shared/             # pagination, formatting, body truncation
|- tools/              # tool families by domain
|- context.ts          # per-request context shape
|- index.ts            # bootstrap + public exports
```

## WHERE TO LOOK

| Task                         | Location                                                                                   | Notes                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Add or remove tool families  | `tools/index.ts`                                                                           | keep registry order readable             |
| Change config surface        | `config/schema.ts`, `config/load-config.ts`, `config/default-config.ts`                    | schema/defaults/loader must stay aligned |
| Change auth or HTTP behavior | `github/client.ts`                                                                         | centralize request logic here            |
| Change repository defaulting | `github/repository-ref.ts`                                                                 | owner/repo resolution rules              |
| Change truncation policy     | `shared/body-window.ts`, `shared/formatting.ts`                                            | tool outputs rely on these helpers       |
| Add tool-specific logic      | `tools/actions/`, `tools/issues/`, `tools/pull-requests/`, `tools/repos/`, `tools/search/` | keep domain boundaries intact            |

## CONVENTIONS

- Prefer type imports where possible; ESLint enforces this.
- Keep tool outputs structured and compact; pagination and truncation helpers exist to reduce context waste.
- If a config knob exists, apply it in real runtime behavior rather than only documenting it.
- Route GitHub API behavior through `GitHubClient` instead of duplicating fetch logic in tools.
- Preserve Turkish runtime text across tool descriptions and user-visible result messages.

## ANTI-PATTERNS

- Do not bypass `filterTools` or read-only checks when adding write-capable tools.
- Do not return raw large issue/PR bodies or diffs without using existing clamp helpers.
- Do not mix unrelated GitHub domains into one tool file; keep domain folders focused.
- Do not add placeholder tool factories or fake scaffold responses.

## NOTES

- `github/client.ts` is the highest-leverage file in `src/`; changes there affect most tools.
- `tools/index.ts` plus `config/schema.ts` define the product surface area.
- If `src/` grows another clear domain with 20+ files or deeper internal conventions, split a child `AGENTS.md` there instead of bloating this file.

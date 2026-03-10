# Security

Turkce surum: [SECURITY.tr.md](./SECURITY.tr.md)

For the GitHub Security policy used by repository health checks, see `.github/SECURITY.md`.

## Supported versions

This repository currently documents security fixes only for the latest code published from `main`.

## Reporting a vulnerability

Do not open a public GitHub issue for security-sensitive reports.

Use the repository Security tab to open a private security advisory.

No alternate private reporting channel is currently documented in this repository. If the advisory flow is unavailable, maintainer confirmation is required before any disclosure outside that channel.

## Scope notes

`mcp-gitpro` is intentionally limited to GitHub API workflows over stdio. The following areas are out of scope for product security guarantees because they are not product features here:

- local shell execution
- local filesystem mutation
- local git CLI automation
- browser automation
- HTTP transport in v1

Security reports are still relevant when they affect token handling, read-only enforcement, tool filtering, MCP protocol output boundaries, GitHub API request handling, or published release artifacts.

Last updated: 2026-03-10

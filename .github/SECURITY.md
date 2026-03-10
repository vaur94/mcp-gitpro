# Security Policy

Root documentation version: [`../SECURITY.md`](../SECURITY.md)

Thanks for helping keep `mcp-gitpro` safe.

## Supported Versions

This project currently supports security fixes on the latest code published from the `main` branch.

| Version                 | Supported |
| ----------------------- | --------- |
| `main`                  | Yes       |
| older tags and branches | No        |

## Reporting a Vulnerability

Please do not open a public GitHub issue for security-sensitive reports.

Use a private security advisory through the GitHub Security tab for this repository.

No alternate private reporting channel is currently documented here. If the advisory flow is unavailable, maintainer confirmation is required before any disclosure outside that channel.

Include reproduction steps, impacted configuration, and whether the issue affects runtime MCP behavior or only development/release tooling.

We will try to acknowledge valid reports quickly and coordinate a fix before public disclosure when reasonable.

## Scope Notes

`mcp-gitpro` is intentionally scoped to GitHub API workflows over stdio. The following areas are out of scope for product security guarantees because they are not product features in this repository:

- local shell execution
- local filesystem mutation
- local git CLI automation
- browser automation
- HTTP transport in v1

Security reports are still welcome when they affect:

- token handling
- tool allowlisting or read-only enforcement
- MCP protocol output boundaries
- GitHub API request handling
- release artifacts published from this repository

Last updated: 2026-03-10

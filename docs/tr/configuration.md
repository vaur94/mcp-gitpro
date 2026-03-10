# Konfigurasyon

English version: [docs/en/configuration.md](../en/configuration.md)

`mcp-gitpro`, `mcp-gitpro.config.json` dosyasini ve `MCP_GITPRO_` ortam degiskeni on ekini kullanir.

## Oncelik sirasi

1. yerlesik varsayilanlar
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` ortam degerleri
4. `mcpbase` tarafindan parse edilen CLI argumanlari

## Ana alanlar

- `auth.githubToken`
- `defaults.owner`
- `defaults.repo`
- `defaults.apiBaseUrl`
- `context.readOnly`
- `context.toolsets`
- `context.tools`
- `output.pageSize`, `output.maxFileLines`, `output.maxDiffLines`, `output.maxBodyChars`

## Pratik varsayilanlar

- `pageSize`: `20`
- `maxFileLines`: `200`
- `maxDiffLines`: `200`
- `maxBodyChars`: `6000`

Son guncelleme: 2026-03-10

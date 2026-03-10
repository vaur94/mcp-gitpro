# Mimari

English version: [docs/en/architecture.md](../en/architecture.md)

## Calisma zamani katmanlari

- `src/index.ts`, stdio sunucusunu `ApplicationRuntime`, `createMcpServer` ve `startStdioServer` ile baslatir
- `src/config/`, schema, varsayilanlar ve config yukleme akisini tanimlar
- `src/core/tool-filtering.ts`, salt-okunur ve allowlist filtrelemesini uygular
- `src/github/client.ts`, GitHub API isteklerini, kimlik kontrollerini, indirme adreslerini ve cikti kirpma davranisini merkezilestirir
- `src/tools/`, context, repo, search, issue, pull request ve Actions arac ailelerini barindirir

## Istek akisi

1. Konfigurasyon yuklenir.
2. Her istek baglami icin bir `GitHubClient` olusturulur.
3. Arac listesi `toolsets`, `tools` ve `readOnly` ile filtrelenir.
4. Stdio sunucusu kalan MCP araclarini disariya acar.

## Urun sinirlari

Bu repo yerel git otomasyonunu, dosya sistemi duzenlemeyi, shell calistirmayi, browser otomasyonunu ve v1 icin HTTP transport'u bilerek disarida birakir.

Son guncelleme: 2026-03-10

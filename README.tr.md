# mcp-gitpro

[🇬🇧 English](./README.md) | 🇹🇷 Turkce

> `mcp-gitpro`, `@vaur94/mcpbase` uzerine kurulu, AI ajanlari icin kucuk ama yuksek degerli bir GitHub MCP sunucusudur.

## Neden mcp-gitpro

- Yerel git CLI yerine GitHub bulut akislarina odaklanir
- Kucuk arac yuzeyi ile context sisimini azaltir
- Salt-okunur mod, toolset ve tekil arac allowlist ile kontrol sunar
- OpenCode, VS Code ve Antigravity entegrasyonlarini aciklar

## Toolsetler

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

## Araclar

- `github_context`
- `repository_read`
- `repository_compare`
- `search_github`
- `issue_read`
- `issue_write`
- `pull_request_read`
- `pull_request_write`
- `actions_read`
- `actions_write`

## Hizli baslangic

```bash
npm install
npm run build
npm test
```

`MCP_GITPRO_GITHUB_TOKEN` degiskenini ayarlayin veya `mcp-gitpro.config.json` icine yazin.

## Proje Yapisi

```text
src/
  config/
  github/
  core/
  shared/
  tools/
tests/
  unit/
  protocol/
docs/
```

## mcpbase Entegrasyonu

- `mcp-gitpro`, `@vaur94/mcpbase` paketini npm bagimliligi olarak kullanir; base framework fork'lanmaz veya depoya kopyalanmaz.
- Baslatma akisi, GitHub baglamini kontrollu kurmak icin `ApplicationRuntime`, `createMcpServer` ve `startStdioServer` ile elle baglanir.
- Konfigurasyon `createRuntimeConfigSchema` ve `loadConfig` ile genisletilir; arac calisma baglami ise `BaseToolExecutionContext` ustune `GitHubClient` ekler.
- Streamable HTTP, telemetry ve genel dosya sistemi/shell guvenlik yardimcilari bu urunde bilerek kullanilmaz; cunku urun stdio-first ve GitHub API odakli kalir.

## Dokumantasyon

- [English docs index](./docs/README.en.md)
- [Turkce docs index](./docs/README.tr.md)
- [Konfigurasyon](./docs/configuration.md)
- [Araclar](./docs/tools.md)
- [OpenCode entegrasyonu](./docs/integration/opencode.md)
- [VS Code entegrasyonu](./docs/integration/vscode.md)
- [Antigravity entegrasyonu](./docs/integration/antigravity.md)

## Kapsam disi

- yerel git CLI akislari
- dosya sistemi duzenleme veya patch uygulama
- shell calistirma
- browser otomasyonu
- HTTP transport (v1)

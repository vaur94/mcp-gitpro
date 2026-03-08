# mcp-gitpro

[🇬🇧 English](./README.md) | 🇹🇷 Turkce

> ✨ `@vaur94/mcpbase` uzerine kurulu, stdio-first ve uretim odakli bir GitHub MCP sunucusu.

`mcp-gitpro`, ajanlara kucuk ama yuksek faydali bir GitHub arac yuzeyi sunarken yerel git, dosya sistemi mutasyonu, shell calistirma ve browser otomasyonu gibi alanlara tasmaz. Hedefi net: yuksek degerli GitHub akislari, dusuk context maliyeti ve acik guvenlik sinirlari.

## ✨ Neden mcp-gitpro

- Repo, issue, pull request, search ve Actions odakli GitHub arac yuzeyi
- Read-only mod, toolset allowlist ve tekil tool allowlist ile token tuketimini daraltma
- Strict TypeScript, stdio-first runtime, protokol testleri ve release otomasyonu
- English ve Turkce icin net ayri dokumantasyon agaci
- Fork yerine yayinlanmis `@vaur94/mcpbase` paketi uzerine kurulu yapi

## 📦 Kurulum

### Gereksinimler

- Node.js `>=22.14.0`
- npm `>=10`
- `MCP_GITPRO_GITHUB_TOKEN` olarak erisilebilir bir GitHub tokeni

### Yerel kurulum script'i

```bash
bash ./scripts/install-local.sh
```

Bu script bagimliliklari kurar, sunucuyu derler ve testleri calistirir.

### Elle kurulum

```bash
npm install
npm run build
npm test
```

Repo varsayimlari ve davranis bayraklari icin `mcp-gitpro.config.json` kullanin; secret degerleri kaynak koda yazmayin.

## ⚡ Hizli Baslangic

### Minimal yerel calistirma

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

### Host baglamadan once kalite kapisi

```bash
npm run ci:check
```

### Tum stdio host'larda ortak degerler

- calistirici: `node`
- giris noktasi: `/absolute/path/to/mcp-gitpro/dist/index.js`
- config bayragi: `--config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- token: `MCP_GITPRO_GITHUB_TOKEN=...`
- protokol kurali: stdout MCP icin ayrilir; loglar stderr'e gider

## 🔌 Entegrasyon Rehberleri

| Host            | Entegrasyon modeli                                         | Rehber                                              |
| --------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| OpenCode        | `opencode.json` icinde local MCP ve command dizisi         | [OpenCode](./docs/tr/integration/opencode.md)       |
| Codex CLI / IDE | `config.toml` icinde `[mcp_servers.<ad>]`                  | [Codex](./docs/tr/integration/codex.md)             |
| VS Code         | workspace MCP JSON ile `command`, `args`, `env`            | [VS Code](./docs/tr/integration/vscode.md)          |
| Antigravity     | absolute executable path kullanan `mcpServers` JSON girisi | [Antigravity](./docs/tr/integration/antigravity.md) |

## 🧰 Arac Yuzeyi

### Toolset'ler

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

### Araclar

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

## ⚙️ Konfigurasyon

Konfigurasyon onceligi:

1. yerlesik varsayilanlar
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` ortam degiskenleri
4. `mcpbase` tarafindan islenen CLI bayraklari

Onemli alanlar:

- `auth.githubToken`
- `defaults.owner`
- `defaults.repo`
- `defaults.apiBaseUrl`
- `context.readOnly`
- `context.toolsets`
- `context.tools`
- `output.pageSize`
- `output.maxFileLines`
- `output.maxDiffLines`
- `output.maxBodyChars`

## 🏗️ Proje Yapisi

```text
mcp-gitpro/
|- src/
|  |- config/
|  |- core/
|  |- github/
|  |- shared/
|  |- tools/
|- tests/
|  |- unit/
|  |- protocol/
|- docs/
|  |- en/
|  |- tr/
|- scripts/
```

## 🔗 mcpbase Entegrasyonu

- `mcp-gitpro`, npm uzerinden yayinlanan `@vaur94/mcpbase` paketine baglidir
- baslatma akisi `ApplicationRuntime`, `createMcpServer` ve `startStdioServer` ile kurulur
- config zinciri `createRuntimeConfigSchema` ve `loadConfig` ile genisletilir
- calisma baglami `BaseToolExecutionContext` uzerine `GitHubClient` ekler
- streamable HTTP ve telemetry bu GitHub odakli stdio urununde bilerek kullanilmaz

## 📚 Dokumantasyon

- English docs index: [`docs/en/README.md`](./docs/en/README.md)
- Turkce docs index: [`docs/tr/README.md`](./docs/tr/README.md)
- English configuration: [`docs/en/configuration.md`](./docs/en/configuration.md)
- Turkce configuration: [`docs/tr/configuration.md`](./docs/tr/configuration.md)
- Security policy: [`.github/SECURITY.md`](./.github/SECURITY.md)

## 🧪 Kalite Kapilari

```bash
npm run build
npm run typecheck
npm run test
npm run test:coverage
npm run test:protocol
npm run ci:check
```

## 🛡️ Kapsam ve Kapsam Disi Alanlar

Bu repo bilerek su alanlari kapsam disi birakir:

- yerel git CLI akislari
- dosya sistemi duzenleme veya patch uygulama
- shell calistirma
- browser otomasyonu
- HTTP transport (v1)

Guvenlik kontrolleri token tabanli kimlik dogrulama, read-only mod, tool allowlist, output limitleri ve Actions loglarini ayri indirme adresiyle sunma uzerine kuruludur.

## 📄 Lisans

MIT - [`LICENSE`](./LICENSE).

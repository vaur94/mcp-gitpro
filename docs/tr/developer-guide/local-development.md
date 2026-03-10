# Yerel Gelistirme

English version: [docs/en/developer-guide/local-development.md](../../en/developer-guide/local-development.md)

## Kurulum

1. `npm install`
2. `npm run build`
3. `npm test`
4. `npm run ci:check`

## Onemli Dosyalar

- `package.json`: scriptler ve paket kimligi
- `tsconfig.json`: strict TypeScript ayarlari
- `tsup.config.ts`: ESM build ciktilari
- `vitest.config.ts`: test ve coverage kurallari
- `mcp-gitpro.config.json`: yerel konfigurasyon ornegi

## mcpbase Kullanimi

- Temel altyapi `@vaur94/mcpbase` paketinden gelir; repo base kutuphaneyi fork etmez.
- `src/index.ts`, `ApplicationRuntime`, `StderrLogger`, `createMcpServer` ve `startStdioServer` ile stdio sunucusunu kurar.
- `src/config/schema.ts` ve `src/config/load-config.ts`, `createRuntimeConfigSchema` ve `loadConfig` ile `mcpbase` konfigurasyon zincirini genisletir.
- `src/context.ts`, `BaseToolExecutionContext` uzerine GitHub'a ozgu `GitHubClient` baglamini ekler.
- Toolset allowlist ve salt-okunur filtreleme bu repoda `src/core/tool-filtering.ts` icinde uygulanir; HTTP transport ve telemetry ise urun kapsaminda olmadigi icin kullanilmaz.

## Notlar

- Protokol testleri derlenmis `dist/index.js` giris noktasini kullanir.
- Unit testler GitHub davranisini mock'lar ve canli API erisimi gerektirmez.

Son guncelleme: 2026-03-10

# Hizli Baslangic

English version: [docs/en/quick-start.md](../en/quick-start.md)

Bu yol repo icinden yerel calistirma icindir.

## Gereksinimler

- Node.js `>=22.14.0`
- npm `>=10`
- `MCP_GITPRO_GITHUB_TOKEN` olarak erisilebilen bir GitHub tokeni

## Yerel kurulum

```bash
bash ./scripts/install-local.sh
```

Bu script bagimliliklari kurar, projeyi derler ve testleri calistirir.

## Stdio sunucusunu baslatma

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

## Host tarafinda gerekli degerler

- komut: `node`
- giris noktasi: `/absolute/path/to/mcp-gitpro/dist/index.js`
- config argumani: `--config /absolute/path/to/mcp-gitpro/mcp-gitpro.config.json`
- token ortam degiskeni: `MCP_GITPRO_GITHUB_TOKEN`

## Sonraki okumalar

- [Kurulum](./installation.md)
- [Kullanim](./usage.md)
- [Konfigurasyon](./configuration.md)

Son guncelleme: 2026-03-10

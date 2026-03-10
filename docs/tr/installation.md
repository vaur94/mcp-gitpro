# Kurulum

English version: [docs/en/installation.md](../en/installation.md)

## Dogrulanmis kurulum yolu

Repo `scripts/install-local.sh` altinda bir yerel kurulum script'i sunar.

```bash
bash ./scripts/install-local.sh
```

Bu script su adimlari uygular:

1. `node` komutunun varligini kontrol eder
2. `npm` komutunun varligini kontrol eder
3. `npm install` calistirir
4. `npm run build` calistirir
5. `npm test` calistirir

## Elle esdeger akis

```bash
npm install
npm run build
npm test
```

## Yayinlanan paket notu

`package.json`, public bir paket tanimlar ve `mcp-gitpro` CLI girisini `bin/cli.js` uzerinden acar. Bu repo icin kanitlanmis kurulum akisi yine de yukaridaki yerel script'tir.

Son guncelleme: 2026-03-10

# Gelistirme

English version: [docs/en/development.md](../en/development.md)

## Yerel akis

Ilk kurulum icin install script'ini kullanin:

```bash
bash ./scripts/install-local.sh
```

Aktif gelistirme sirasinda temel komutlar `package.json` icinden gelir:

- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run test:coverage`
- `npm run test:protocol`
- `npm run ci:check`

## Nerede calisilir

- `src/` runtime, config, GitHub client davranisi ve araclar icin
- `tests/` unit ve protocol coverage icin
- `docs/` iki dilli proje belgeleri ve host entegrasyon rehberleri icin
- `.github/workflows/ci.yml` kalite ve release otomasyonu icin

## Detayli rehberler

- [Yerel gelistirme detayi](./developer-guide/local-development.md)
- [Surum sureci detayi](./developer-guide/release-process.md)

Son guncelleme: 2026-03-10

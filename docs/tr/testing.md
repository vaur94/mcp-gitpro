# Testler

English version: [docs/en/testing.md](../en/testing.md)

## Komutlar

- `npm run test` unit ve protocol testlerini calistirir
- `npm run test:unit` yalnizca unit testlerini calistirir
- `npm run test:protocol` once build alir, sonra protocol testlerini calistirir
- `npm run test:coverage` coverage ile unit testlerini calistirir
- `npm run ci:check` format, lint, typecheck, unit coverage, build ve protocol testlerini birlikte calistirir

## Testlerin dogruladigi alanlar

- dosya ve ortam degiskenlerinden config yukleme
- salt-okunur mod ve allowlist filtreleme davranisi
- GitHub client auth, hata yuzeye cikarma ve kirpma davranisi
- stdio uzerinde protocol seviyesinde arac kaydi ve hata davranisi

## Notlar

- Protocol testleri derlenmis `dist/index.js` giris noktasini kullanir.
- Unit testler canli API yerine GitHub davranisini mock'lar.

Son guncelleme: 2026-03-10

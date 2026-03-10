# Katki Rehberi

English version: [CONTRIBUTING.md](./CONTRIBUTING.md)

`mcp-gitpro`, urun kapsami bilerek dar tutulmus GitHub odakli bir stdio MCP sunucusudur. Katkilar su sinirlara sadik kalmalidir: yerel git CLI akislari yok, dosya sistemi duzenleme yok, shell calistirma yok, browser otomasyonu yok, v1 icin HTTP transport yok.

## Kod degistirmeden once

1. Repo'ya ozel kurallar icin `AGENTS.md` ve `src/AGENTS.md` dosyalarini okuyun.
2. Bagimliliklari kurup projeyi derleyin:

```bash
bash ./scripts/install-local.sh
```

3. Kod degisikliklerinden sonra pull request acmadan once tam kalite kapisini calistirin:

```bash
npm run ci:check
```

## Her degisiklikte neler guncellenmeli

- Davranis degisiklikleri icin `tests/unit/` veya `tests/protocol/` altinda testler
- Tool davranisi, kurulum, konfigurasyon veya release akisi degisirse dokumantasyon
- Runtime mesajlari veya MCP cikti metinleri degisirse Turkce kullaniciya donuk metinler

## Dogrulanmis repo beklentileri

- Proje ESM-only'dir ve TypeScript import'larinda `.js` uzantilari kullanir.
- Runtime ve kullaniciya donuk metinler Turkce kalir.
- CI, `npm run ci:check` icinde format, lint, typecheck, unit coverage, build ve protocol testlerini calistirir.
- Release sureci `main` dali, GitHub Actions ve `release-it` uzerinden otomatiklesmistir.

## Onerilen varsayilanlar

Repo su anda zorunlu dallanma kurallarini yayinlamiyor. Maintainer daha net kurallar yayinlayana kadar su varsayilanlar uyumludur:

- Dal adlari: `docs/...`, `fix/...`, `feat/...`, `chore/...`
- Commit mesajlari: uygun oldugunda conventional commit stili; changelog conventional changelog eklentisi ile uretilir
- Pull request'ler: kapsam, dogrulama adimlari ve dokumantasyon etkisi acikca yazilsin

## Pull request kontrol listesi

- Kapsam belgelenmis urun sinirlari icinde kaliyor
- Ilgili belgeler gerektiğinde English ve Turkce birlikte guncelleniyor
- `npm run ci:check` yerelde geciyor
- Yeni davranis testlerle veya test gerekmedigine dair acik bir gerekceyle destekleniyor
- Guvenlik hassasiyeti tasiyan konular PR aciklamasinda acik edilmemis

Son guncelleme: 2026-03-10

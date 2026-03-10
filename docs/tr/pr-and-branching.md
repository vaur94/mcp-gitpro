# PR ve Dallanma

English version: [docs/en/pr-and-branching.md](../en/pr-and-branching.md)

## Dogrulanmis bilgiler

- Varsayilan release dali `main` dalidir.
- Pull request'ler `.github/workflows/ci.yml` icindeki kalite workflow'unu tetikler.
- `main` dalina gelen push'lar kalite isi gectiginde otomatik release surecini tetikleyebilir.
- Release commit'leri `.release-it.json` icinde `chore(release): v${version}` bicimini kullanir.

## Onerilen varsayilanlar

Repo henuz kati dallanma kurallari yayinlamiyor. O zamana kadar mevcut akisla uyumlu varsayilanlar sunlardir:

- `docs/...`, `fix/...`, `feat/...`, `chore/...` gibi dal adlari
- kullanilan dogrulama komutunu acikca yazan pull request'ler
- changelog conventional changelog eklentisi ile uretildigi icin uygun yerlerde conventional commit stili

## PR acmadan once

- `npm run ci:check` calistirin
- kullaniciya dokunan degisikliklerde English ve Turkce belgeleri birlikte guncelleyin
- kapsamin urun sinirlari icinde kaldigini dogrulayin

Son guncelleme: 2026-03-10

# Surum Sureci

English version: [docs/en/developer-guide/release-process.md](../../en/developer-guide/release-process.md)

## Akis

1. Bir maintainer surum ve changelog guncellemelerini normal bir branch uzerinde hazirlar ve PR acar.
2. `main` yayim dali olarak kalir, ancak release metadata bu dala workflow push'u ile degil PR merge'i ile ulasir.
3. GitHub Actions merge edilmis commit uzerinde `npm run ci:check` calistirir.
4. Publish isi `npm pack --dry-run` calistirir, `package.json` surumunu npm'deki canli surumle karsilastirir ve yalnizca merge edilmis surum daha yeniyse yayim yapar.
5. Yayimdan sonra workflow, `main`e release commit'i yazmadan ayni merge edilmis commit uzerinden eslesen GitHub release ve tag bilgisini olusturur.
6. npm'de ayni surum zaten varsa ama GitHub release metadata'si eksikse, workflow daha yeni bir commit uzerinde yanlis tag/release olusturmamak icin durur ve manuel uzlastirma ister.

## Gerekli ortam

- `GITHUB_TOKEN`
- `vaur94/mcp-gitpro` ve `ci.yml` icin npm trusted publishing eslestirmesi

Publish isi icin `id-token: write`, tam git gecmisi ve npm trusted publisher eslesmesi gerekir.

## Bilinen saglam taban

- `release-it` artik CI yayimlayicisi degil, yerel PR-hazirlama yardimcisidir.
- CI artik `main` dalina release commit'i geri yazmaz.
- GitHub Actions, publish'i zaten merge edilmis commit uzerinden yapar ve GitHub release/tag bilgisini o committen olusturur.
- Publish isi, `package.json` npm'deki canli surumden gerideyse atlar; boylece kismi release sonrasinda eski bir surum tekrar yayimlanmaz.
- Publish isi, npm'de mevcut surum zaten varken GitHub release metadata'si eksikse de atlar; bu durum manuel uzlastirma gerektirir.
- Publish isi workflow concurrency kullandigi icin `main` dalina hizli arka arkaya gelen push'lar ayni surumu yarisa sokmaz.
- `package.json` su anda `1.0.3` surumunu tasir; buna karsilik `mcp-gitpro.config.json`, `src/config/default-config.ts` ve `src/github/client.ts` icindeki bazi runtime/config sabitleri halen `0.1.0` degerini gosterir.

## Yerel surum hazirligi

Surum PR'i taslagini yerelde hazirlamak isterseniz `npm run release` komutu mevcut branch uzerinde version bump ve changelog hazirlayabilir. Artik npm yayimi yapmaz, GitHub release olusturmaz, tag basmaz ve remote'a push etmez.

Bu yardimciyi yalnizca PR'a donecek temiz bir branch uzerinde calistirin; cunku hala yerel version ve changelog dosyalarini yazar.

Son guncelleme: 2026-03-10

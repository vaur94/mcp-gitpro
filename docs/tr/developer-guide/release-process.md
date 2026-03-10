# Surum Sureci

English version: [docs/en/developer-guide/release-process.md](../../en/developer-guide/release-process.md)

## Akis

1. Conventional commit mesajlari `release-it` ve conventional changelog eklentisi tarafindan analiz edilir.
2. `main` dali surum dali olarak kalir.
3. GitHub Actions once `npm run ci:check` calistirir.
4. `main` uzerindeki yesil push surumu artirabilir, `CHANGELOG.md` dosyasini gunceller, git etiketi olusturur, GitHub release cikarir ve npm trusted publishing ile yayim yapar.

## Gerekli ortam

- `GITHUB_TOKEN`
- `vaur94/mcp-gitpro` ve `ci.yml` icin npm trusted publishing eslestirmesi

Release isi icin `id-token: write`, tam git gecmisi ve npm trusted publisher eslesmesi gerekir.

## Bilinen saglam taban

- Aktif surum araci `release-it`.
- Release workflow, kendi kendini tekrar tetikleyen publish dongulerini engellemek icin `chore(release):` ile baslayan push'lari release adiminda dislar.
- `package.json` su anda `1.0.2` surumunu tasir; buna karsilik `mcp-gitpro.config.json`, `src/config/default-config.ts` ve `src/github/client.ts` icindeki bazi runtime/config sabitleri halen `0.1.0` degerini gosterir.
- GitHub Actions release adiminda bot identity ortam degiskenleri kullanilir; boylece interaktif git ayari gerektirmeden release commit ve tag olusturulabilir.

Son guncelleme: 2026-03-10

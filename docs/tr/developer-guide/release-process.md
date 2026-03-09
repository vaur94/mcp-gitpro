# Surum Sureci

## Akis

1. Conventional commit mesajlari `release-it` ve conventional changelog eklentisi tarafindan analiz edilir.
2. `main` dali surum dali olarak kalir.
3. GitHub Actions once `npm run ci:check` calistirir.
4. `main` uzerindeki yesil push surumu artirabilir, `CHANGELOG.md` dosyasini gunceller, git etiketi olusturur, GitHub release cikarir ve npm trusted publishing ile yayim yapar.

## Gerekli ortam

- `GITHUB_TOKEN`
- `vaur94/mcp-gitpro` ve `ci.yml` icin npm trusted publishing eslestirmesi

Release isi icin `id-token: write`, tam git gecmisi ve npm trusted publisher eslesmesi gerekir.

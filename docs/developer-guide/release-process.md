# Surum Sureci

## Akis

1. Conventional commit mesajlari `semantic-release` tarafindan analiz edilir.
2. `main` dali surum dali olarak kalir.
3. GitHub Actions once `npm run ci:check` calistirir.
4. `NPM_TOKEN` tanimliysa, `main` uzerindeki yesil push surum metaverisi ve npm yayini ilerletir.

## Gerekli secret'lar

- `GITHUB_TOKEN`
- `NPM_TOKEN`

## Notlar

- Bu iskelet yalnizca surum konfigurasyonunu ekler.
- `NPM_TOKEN` yoksa release isi atlanir ve taze repoda kalite CI yesil kalir.

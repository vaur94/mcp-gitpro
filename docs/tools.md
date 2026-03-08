# Araclar

`mcp-gitpro`, 10 araclik kucuk ama yuksek degerli bir yuzey sunar:

- `github_context`
- `repository_read`
- `repository_compare`
- `search_github`
- `issue_read`
- `issue_write`
- `pull_request_read`
- `pull_request_write`
- `actions_read`
- `actions_write`

## Tasarim notlari

- Her arac okunabilir metin ve yapilandirilmis icerik dondurur.
- Okuma araclari salt-okunur modda acik kalir.
- Yazma araclari `context.readOnly=true` ise kayittan dusurulur.
- Buyuk yanitlar modele gitmeden once kirpilir.
- `actions_read`, satir ici log onizlemesi yerine workflow metaverisi ve log indirme adresi dondurur.

# Guvenlik

English version: [SECURITY.md](./SECURITY.md)

GitHub topluluk sagligi kontrolleri tarafindan kullanilan guvenlik politikasi icin `.github/SECURITY.md` dosyasina bakin.

## Desteklenen surumler

Bu repo su anda guvenlik duzeltmelerini yalnizca `main` dalindan yayinlanan en guncel kod icin belgeliyor.

## Acik bildirme yolu

Guvenlik hassasiyeti tasiyan bildirimler icin genel GitHub issue acmayin.

Repo Security sekmesi uzerinden ozel bir security advisory acin.

Bu repoda bunun disinda belgelenmis alternatif bir ozel bildirim kanali yoktur. Advisory akisi kullanilamiyorsa, o kanal disinda paylasim yapmadan once maintainer onayi gerekir.

## Kapsam notlari

`mcp-gitpro`, stdio uzerinden GitHub API akislari ile sinirlidir. Asagidaki alanlar bu repodaki urun ozellikleri olmadigi icin urun guvenlik garantilerinin disindadir:

- yerel shell calistirma
- yerel dosya sistemi mutasyonu
- yerel git CLI otomasyonu
- browser otomasyonu
- HTTP transport (v1)

Yine de token yonetimi, salt-okunur enforcement, arac filtreleme, MCP cikti sinirlari, GitHub API istekleri veya yayinlanan release artefact'larini etkileyen guvenlik raporlari kapsama dahildir.

Son guncelleme: 2026-03-10

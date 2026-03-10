# Guvenlik

English version: [docs/en/security.md](../en/security.md)

Bu temel kurulum stdio-first kalir ve yerel shell, git CLI, dosya duzenleme ve HTTP transport davranisini bilerek kapsam disinda birakir.

## Mevcut Kontroller

- Config dosyasi veya ortam degiskeni ile zorunlu GitHub tokeni
- Yazma yapabilen arac aileleri icin salt-okunur anahtari
- Arac seti ve arac allowlist alanlari
- Yanit boyutunu sinirlayan cikti limitleri
- Actions loglari govde icine gomulmez; GitHub indirme adresi ayri olarak dondurulur
- stdout yalnizca MCP protokol trafigine ayrilir

## Kapsam disi urun alanlari

- yerel shell calistirma
- yerel git CLI otomasyonu
- yerel dosya sistemi mutasyonu
- browser otomasyonu
- HTTP transport (v1)

Gercek GitHub islemleri eklenirken bu sinirlar acik bicimde korunmalidir.

Ayrica bakiniz: [`../../SECURITY.md`](../../SECURITY.md) ve [`../../.github/SECURITY.md`](../../.github/SECURITY.md).

Son guncelleme: 2026-03-10

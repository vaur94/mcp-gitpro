# Sorun Giderme

English version: [docs/en/troubleshooting.md](../en/troubleshooting.md)

## `GitHub token tanimli degil.`

GitHub client, `MCP_GITPRO_GITHUB_TOKEN` olmadiginda kimlik gerektiren istekleri reddeder. Token'i ortam degiskeni olarak verin veya config icinde `auth.githubToken` tanimlayin.

## Yazma araci gorunmuyor

`context.readOnly` degeri `true` ise yazma yapabilen araclar kayittan once filtrelenir. `mcp-gitpro.config.json` ve varsa `MCP_GITPRO_READ_ONLY` override degerini kontrol edin.

## Toolset gorunmuyor

Sunucu araclari hem `context.toolsets` hem de `context.tools` alanlarina gore filtreler. Gerekli toolset veya arac adinin izinli oldugunu dogrulayin.

## Host icinde MCP cikti akisi bozuk gorunuyor

Bu proje stdout'u MCP protokol trafigine ayirir. Loglari stderr'de tutun ve sunucunun stdout akisini baska katmanlarla bozmayin.

Son guncelleme: 2026-03-10

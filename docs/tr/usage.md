# Kullanim

English version: [docs/en/usage.md](../en/usage.md)

## Sunucuyu repo icinden baslatma

```bash
export MCP_GITPRO_GITHUB_TOKEN=YOUR_GITHUB_TOKEN
node ./dist/index.js --config ./mcp-gitpro.config.json
```

`src/index.ts`, konfigurasyonu yukler, MCP runtime'ini kurar, arac setini olusturur ve stdio sunucusunu baslatir.

## CLI giris noktasi

Yayinlanan paket `mcp-gitpro` komutunu `bin/cli.js` uzerinden acar. Bu giris noktasi `dist/index.js` dosyasini import eder, CLI argumanlarini iletir ve kritik hatalari stderr'e JSON olarak yazar.

## Konfigurasyon kaynaklari

Calisma zamani konfigurasyonu su sirayla gelir:

1. yerlesik varsayilanlar
2. `mcp-gitpro.config.json`
3. `MCP_GITPRO_*` ortam degiskenleri
4. `mcpbase` tarafindan islenen CLI bayraklari

## Arac yuzeyi

Arac kaydi su toolset'lerde 10 arac icerir:

- `context`
- `repos`
- `search`
- `issues`
- `pull_requests`
- `actions`

Salt-okunur mod, yazma yetkili araclari sunucu disariya acmadan once kayittan cikarir.

Son guncelleme: 2026-03-10

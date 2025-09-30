# Mail Dashboard (MVP A)

Unified Inbox über mehrere IMAP-Konten, Dashboard-Kacheln und Volltextsuche (Postgres FTS). Mails bleiben auf dem Provider (z. B. Strato). Aktionen: Verschieben in Ordner (Junk, Finanzen, …). Keine Auto-Löschung.

## Schnellstart
1) Abhängigkeiten installieren
```bash
pnpm i   # oder npm i / yarn
```
2) DB-Schema einspielen
```bash
psql "$DATABASE_URL" -f sql/schema.sql
```
3) Dev starten
```bash
pnpm dev
```

## Railway Env
- DATABASE_URL
- IMAP_ACCOUNTS_JSON (JSON aller Konten)
- SESSION_SECRET

## Tests
```bash
pnpm test
```

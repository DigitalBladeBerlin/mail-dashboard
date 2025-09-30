# PowerShell bootstrap
pnpm i
psql "$env:DATABASE_URL" -f sql/schema.sql
pnpm dev

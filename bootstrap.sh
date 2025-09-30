#!/usr/bin/env bash
set -euo pipefail
pnpm i
psql "$DATABASE_URL" -f sql/schema.sql
pnpm dev

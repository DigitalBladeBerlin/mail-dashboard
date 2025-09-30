import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q')||'';
  const limit = parseInt(url.searchParams.get('limit')||'200');
  if (!query) return NextResponse.json({ items: [] });
  const rows = await q(
    'SELECT m.id, m.account_id, m.folder, m.uid, m.date, m.from_addr, m.subject, m.snippet\n' +
    'FROM bodies b JOIN messages m ON m.id = b.message_id\n' +
    'WHERE b.tsv @@ plainto_tsquery($1)\n' +
    'ORDER BY m.date DESC LIMIT $2',
    [query, limit]
  );
  return NextResponse.json({ items: rows });
}

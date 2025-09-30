import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit')||'100');
  const unread = url.searchParams.get('unread') === 'true';
  const sql = 'SELECT id, account_id, folder, uid, date, from_addr, subject, snippet ' +
              'FROM messages ' +
              "WHERE folder = 'INBOX' " +
              (unread ? "AND NOT ('Seen'=ANY(flags)) " : '') +
              'ORDER BY date DESC LIMIT $1';
  const rows = await q(sql, [limit]);
  return NextResponse.json({ items: rows });
}

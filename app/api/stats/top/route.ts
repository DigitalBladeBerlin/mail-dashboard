import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get('days')||'7');
  const sinceSql = "now() - interval '" + days + " days'";
  const topSenders = await q<{ from_addr: string; cnt: number }>(
    'SELECT from_addr, COUNT(*)::int AS cnt FROM messages WHERE date >= ' + sinceSql + ' GROUP BY from_addr ORDER BY cnt DESC LIMIT 10'
  );
  const topRecipients = await q<{ to_addrs: string; cnt: number }>(
    'SELECT to_addrs, COUNT(*)::int AS cnt FROM messages WHERE date >= ' + sinceSql + ' GROUP BY to_addrs ORDER BY cnt DESC LIMIT 10'
  );
  return NextResponse.json({ topSenders, topRecipients });
}

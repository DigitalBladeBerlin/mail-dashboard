import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function GET() {
  const rows = await q<{ count:number }>('SELECT COUNT(*)::int AS count FROM messages WHERE folder=\'INBOX\' AND date::date = now()::date');
  return NextResponse.json({ today: rows[0]?.count ?? 0 });
}

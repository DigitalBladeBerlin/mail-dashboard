import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function GET(){
  const rows = await q('SELECT id, name, priority, json_conf FROM rules ORDER BY priority ASC');
  return NextResponse.json({ items: rows });
}

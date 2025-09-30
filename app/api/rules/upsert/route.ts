import { NextRequest, NextResponse } from 'next/server';
import { q } from '@/lib/db';
export async function POST(req: NextRequest){
  const body = await req.json();
  const { id, name, priority = 100, json_conf } = body;
  if (!name || !json_conf) return NextResponse.json({ error: 'missing name/json_conf' }, { status: 400 });
  if (id) {
    await q('UPDATE rules SET name=$1, priority=$2, json_conf=$3, updated_at=now() WHERE id=$4', [name, priority, json_conf, id]);
    return NextResponse.json({ ok: true, id });
  } else {
    const rows = await q<{ id:number }>('INSERT INTO rules(name, priority, json_conf) VALUES($1,$2,$3) RETURNING id', [name, priority, json_conf]);
    return NextResponse.json({ ok: true, id: rows[0].id });
  }
}

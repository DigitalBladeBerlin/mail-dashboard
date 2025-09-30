import { NextRequest, NextResponse } from 'next/server';
import { moveMessage } from '@/lib/imap';
export async function POST(req: NextRequest) {
  const { accountId, folder, uid, target } = await req.json();
  if (!accountId || !folder || !uid || !target) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  await moveMessage(accountId, folder, Number(uid), target);
  return NextResponse.json({ ok: true });
}

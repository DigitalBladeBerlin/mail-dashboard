import { NextResponse } from 'next/server';
import { q } from '@/lib/db';
import { matchRule } from '@/lib/rules';
import { moveMessage } from '@/lib/imap';
export async function POST(){
  const rows = await q<any>('SELECT m.*, b.plain_text AS body FROM messages m LEFT JOIN bodies b ON b.message_id=m.id WHERE m.folder=\'INBOX\' AND m.date >= now() - interval \'7 days\' ORDER BY m.date DESC LIMIT 500');
  let moved = 0;
  const rules = await q<any>('SELECT json_conf, priority, name FROM rules ORDER BY priority ASC');
  for (const m of rows) {
    for (const r of rules) {
      const conf = r.json_conf;
      if (matchRule(conf, { from_addr: m.from_addr, from_domain: m.from_domain, subject: m.subject, body: m.body||'', to_addrs: m.to_addrs, flags: m.flags, date: new Date(m.date) })) {
        for (const a of (conf.actions||[])) { if ('move_to_folder' in a) { await moveMessage(m.account_id, m.folder, m.uid, a.move_to_folder); moved++; } }
        break;
      }
    }
  }
  return NextResponse.json({ ok: true, moved });
}

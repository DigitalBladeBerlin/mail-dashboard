import { ImapFlow } from 'imapflow';
import { getAccounts } from './accounts';
import { q } from './db';
import { extractPlainText, addrDomain } from './mail';

export async function listRecent(limit = 100) {
  const rows = await q(
    'SELECT m.id, m.account_id, m.folder, m.uid, m.date, m.from_addr, m.subject, m.snippet\n' +
    'FROM messages m\n' +
    "WHERE m.folder = 'INBOX'\n" +
    'ORDER BY m.date DESC\n' +
    'LIMIT $1',
    [limit]
  );
  return rows;
}

export async function searchFullText(query: string, limit = 200) {
  const rows = await q(
    'SELECT m.id, m.account_id, m.folder, m.uid, m.date, m.from_addr, m.subject, m.snippet\n' +
    'FROM bodies b JOIN messages m ON m.id = b.message_id\n' +
    'WHERE b.tsv @@ plainto_tsquery($1)\n' +
    'ORDER BY m.date DESC\n' +
    'LIMIT $2',
    [query, limit]
  );
  return rows;
}

export async function moveMessage(accountId: string, folder: string, uid: number, target: string) {
  const acc = getAccounts().find(a => a.id === accountId);
  if (!acc) throw new Error('Unknown account');
  const client = new ImapFlow({ host: acc.host, port: acc.port, secure: acc.secure, auth: { user: acc.user, pass: acc.pass }});
  await client.connect();
  try {
    await client.mailboxOpen(folder);
    await client.messageMove(uid, target);
  } finally {
    await client.logout();
  }
}

export async function backfillRecent(days = 14) {
  const accounts = getAccounts();
  const since = new Date(Date.now() - days*24*60*60*1000);
  for (const acc of accounts) {
    const client = new ImapFlow({ host: acc.host, port: acc.port, secure: acc.secure, auth: { user: acc.user, pass: acc.pass }});
    await client.connect();
    try {
      const lock = await client.getMailboxLock(acc.inbox);
      try {
        for await (const msg of client.fetch({ since }, { source: true, envelope: true, uid: true, flags: true, size: true })) {
          const raw = Buffer.from(msg.source!);
          const { text, snippet, hasAttachments } = await extractPlainText(raw);
          const from = msg.envelope?.from?.[0]?.address || null;
          const to = (msg.envelope?.to || []).map(x=>x.address).filter(Boolean).join(',');
          await q(
            'WITH ins AS (\n' +
            '  INSERT INTO messages(account_id, folder, uid, msgid, date, from_addr, from_domain, to_addrs, subject, has_attachments, size, flags, snippet)\n' +
            '  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)\n' +
            '  ON CONFLICT (account_id, folder, uid) DO UPDATE SET snippet = EXCLUDED.snippet\n' +
            '  RETURNING id\n' +
            ')\n' +
            'INSERT INTO bodies(message_id, plain_text) VALUES((SELECT id FROM ins), $14)\n' +
            'ON CONFLICT (message_id) DO UPDATE SET plain_text = EXCLUDED.plain_text\n',
            [acc.id, acc.inbox, msg.uid, msg.envelope?.messageId || null, msg.envelope?.date || new Date(), from, addrDomain(from), to,
             msg.envelope?.subject || '', hasAttachments, msg.size || 0, (msg.flags?Array.from(msg.flags):[]), snippet, text]
          );
        }
      } finally { lock.release(); }
    } finally {
      await client.logout();
    }
  }
}

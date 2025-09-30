import { ImapAccount } from './types';
export function getAccounts(): ImapAccount[] {
  const raw = process.env.IMAP_ACCOUNTS_JSON;
  if (!raw) throw new Error('IMAP_ACCOUNTS_JSON not set');
  const arr = JSON.parse(raw);
  return arr as ImapAccount[];
}

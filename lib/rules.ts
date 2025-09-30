import type { RuleConf } from './types';
export function matchRule(r: RuleConf, m: { from_addr?: string|null; from_domain?: string|null; subject?: string; body?: string; to_addrs?: string|null; flags?: string[]|null; date: Date; }) {
  const { match } = r;
  if (match.from && match.from.length) {
    const fa = (m.from_addr||'').toLowerCase();
    const ok = match.from.some(p => {
      if (p.includes('*@')) return fa.endsWith(p.replace('*@','@').toLowerCase());
      return fa === p.toLowerCase();
    });
    if (!ok) return false;
  }
  if (match.from_domain && match.from_domain.length) {
    if (!m.from_domain || !match.from_domain.map(d=>d.toLowerCase()).includes(m.from_domain.toLowerCase())) return false;
  }
  if (match.subject_regex) {
    const re = new RegExp(match.subject_regex, 'i');
    if (!re.test(m.subject||'')) return false;
  }
  if (match.body_contains && match.body_contains.length) {
    const body = (m.body||'').toLowerCase();
    const ok = match.body_contains.some(s => body.includes(s.toLowerCase()));
    if (!ok) return false;
  }
  if (match.recipient && match.recipient.length) {
    const to = (m.to_addrs||'').toLowerCase();
    const ok = match.recipient.some(s => to.includes(s.toLowerCase()));
    if (!ok) return false;
  }
  if (typeof match.unread === 'boolean') {
    const unread = !(m.flags||[]).includes('Seen');
    if (match.unread !== unread) return false;
  }
  if (match.older_than_days) {
    const diff = (Date.now() - m.date.getTime()) / 86400000;
    if (!(diff > match.older_than_days)) return false;
  }
  return true;
}

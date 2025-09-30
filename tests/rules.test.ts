import { describe, it, expect } from 'vitest';
import { matchRule } from '../lib/rules';
import type { RuleConf } from '../lib/types';
const baseMsg = {
  from_addr: 'billing@stripe.com',
  from_domain: 'stripe.com',
  subject: 'Ihre Rechnung 2025-09',
  body: 'Hier ist die Rechnung über 120,00 €',
  to_addrs: 'info@example.com',
  flags: ['Seen'],
  date: new Date('2025-09-28T10:00:00Z')
};
describe('matchRule', () => {
  it('matches by from_domain + subject_regex', () => {
    const r: RuleConf = { name: 'Rechnungen', match: { from_domain: ['stripe.com'], subject_regex: 'rechnung|invoice' }, actions: [{ move_to_folder: 'Finanzen/Rechnungen' }] };
    expect(matchRule(r, baseMsg as any)).toBe(true);
  });
  it('matches wildcard from *@domain', () => {
    const r: RuleConf = { name: 'Wildcard', match: { from: ['*@stripe.com'] }, actions: [{ add_label: 'Test' }] };
    expect(matchRule(r, baseMsg as any)).toBe(true);
  });
  it('respects unread flag when required', () => {
    const r: RuleConf = { name: 'Only Unread', match: { unread: true }, actions: [{ add_label: 'OnlyUnread' }] };
    expect(matchRule(r, baseMsg as any)).toBe(false);
  });
  it('matches body_contains', () => {
    const r: RuleConf = { name: 'Body contains', match: { body_contains: ['120,00'] }, actions: [{ add_label: '€' }] };
    expect(matchRule(r, baseMsg as any)).toBe(true);
  });
}
});

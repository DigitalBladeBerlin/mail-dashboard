import { describe, it, expect } from 'vitest';
import { matchRule } from '../lib/rules';
import type { RuleConf } from '../lib/types';
const msg = {
  from_addr: 'hello@newsletter.io',
  from_domain: 'newsletter.io',
  subject: 'Weekly update',
  body: 'Some content here',
  to_addrs: 'team@example.com,ceo@example.com',
  flags: [],
  date: new Date('2025-09-20T12:00:00Z')
};

describe('matchRule (extras)', () => {
  it('does not match when subject_regex fails', () => {
    const r: RuleConf = { name: 'Invoice only', match: { subject_regex: 'rechnung|invoice' }, actions: [{ add_label: 'fin' }] };
    expect(matchRule(r, msg as any)).toBe(false);
  });
  it('matches recipient includes', () => {
    const r: RuleConf = { name: 'to ceo', match: { recipient: ['ceo@example.com'] }, actions: [{ add_label: 'VIP' }] };
    expect(matchRule(r, msg as any)).toBe(true);
  });
  it('older_than_days true/false', () => {
    const older: RuleConf = { name: 'old', match: { older_than_days: 1 }, actions: [{ add_label: 'old' }] };
    const newer: RuleConf = { name: 'new', match: { older_than_days: 9999 }, actions: [{ add_label: 'new' }] };
    expect(matchRule(older, msg as any)).toBe(true);
    expect(matchRule(newer, msg as any)).toBe(false);
  });
});

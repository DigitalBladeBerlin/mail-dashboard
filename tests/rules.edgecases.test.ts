import { describe, it, expect } from 'vitest';
import { matchRule } from '../lib/rules';
import type { RuleConf } from '../lib/types';

const msg = {
  from_addr: 'sender@stripe.com',
  from_domain: 'stripe.com',
  subject: 'RECHNUNG 2025',
  body: 'Bitte zahlen Sie',
  to_addrs: 'a@example.com,b@example.com',
  flags: ['Seen'],
  date: new Date()
};

describe('matchRule edge cases', () => {
  it('subject_regex is case-insensitive', () => {
    const r: RuleConf = { name: 'regex i', match: { subject_regex: 'rechnung' }, actions: [{ add_label: 'ok' }] };
    expect(matchRule(r, msg as any)).toBe(true);
  });
  it('from wildcard does not false-positive on other domains', () => {
    const r: RuleConf = { name: 'not example', match: { from: ['*@example.com'] }, actions: [{ add_label: 'x' }] };
    expect(matchRule(r, msg as any)).toBe(false);
  });
  it('unread:false matches read messages', () => {
    const r: RuleConf = { name: 'read only', match: { unread: false }, actions: [{ add_label: 'read' }] };
    expect(matchRule(r, msg as any)).toBe(true);
  });
});

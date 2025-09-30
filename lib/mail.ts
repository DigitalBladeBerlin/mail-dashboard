import { simpleParser } from 'mailparser';
export async function extractPlainText(raw: Buffer): Promise<{ text: string; snippet: string; hasAttachments: boolean }>{ 
  const parsed = await simpleParser(raw);
  const text = parsed.text || parsed.html?.replace(/<[^>]+>/g, ' ') || '';
  const snippet = text.trim().slice(0, 240);
  const hasAttachments = (parsed.attachments?.length ?? 0) > 0;
  return { text, snippet, hasAttachments };
}
export function addrDomain(addr?: string | null) {
  if (!addr) return null;
  const m = addr.split('@')[1];
  return m ? m.toLowerCase() : null;
}

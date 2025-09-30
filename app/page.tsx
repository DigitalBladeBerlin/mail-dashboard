'use client';
import useSWR from 'swr';
import { Card } from '@/components/Ui';
const fetcher = (url:string)=>fetch(url).then(r=>r.json());
export default function Page(){
  const { data:today } = useSWR('/api/stats/today', fetcher);
  const { data:top } = useSWR('/api/stats/top?days=7', fetcher);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Heute eingegangen"><div className="text-3xl font-bold">{today?.today ?? '…'}</div></Card>
      <Card title="Top 10 Absender (7 Tage)"><ul className="text-sm space-y-1">{top?.topSenders?.map((s:any)=>(<li key={s.from_addr} className="flex justify-between"><span>{s.from_addr||'—'}</span><span>{s.cnt}</span></li>))}</ul></Card>
      <Card title="Top 10 Empfänger (7 Tage)"><ul className="text-sm space-y-1">{top?.topRecipients?.map((s:any)=>(<li key={s.to_addrs} className="flex justify-between"><span className="truncate max-w-[70%]">{s.to_addrs||'—'}</span><span>{s.cnt}</span></li>))}</ul></Card>
      <div className="md:col-span-3"><a className="underline" href="/inbox">Zur Unified Inbox →</a></div>
    </div>
  );
}

'use client';
import useSWR from 'swr';
import { useState } from 'react';
import { Card, Button, Input } from '@/components/Ui';
const fetcher = (url:string)=>fetch(url).then(r=>r.json());
export default function InboxPage(){
  const [q,setQ] = useState('');
  const endpoint = q ? ('/api/imap/search?q=' + encodeURIComponent(q)) : '/api/imap/list?limit=100';
  const { data, mutate } = useSWR(endpoint, fetcher);
  const items = data?.items || [];
  async function move(it:any, target:string){
    await fetch('/api/imap/move', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ accountId:it.account_id, folder:it.folder, uid:it.uid, target })});
    mutate();
  }
  return (
    <div className="space-y-4">
      <Card title="Suche"><div className="flex gap-2"><Input placeholder="Volltext…" value={q} onChange={e=>setQ(e.target.value)} /> <Button onClick={()=>{}}>Suchen</Button></div></Card>
      <Card title={ 'Unified Inbox (' + items.length + ')' }>
        <ul className="divide-y">
          {items.map((it:any)=> (
            <li key={ (it.account_id + '-' + it.uid) } className="py-2 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-gray-500">{new Date(it.date).toLocaleString()}</div>
                <div className="font-medium truncate">{it.subject||'—'}</div>
                <div className="text-sm truncate">{it.from_addr||'—'} — {it.snippet||''}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={()=>move(it,'Junk')}>Junk</Button>
                <Button onClick={()=>move(it,'Papierkorb')}>Papierkorb</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

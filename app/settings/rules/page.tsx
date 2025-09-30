'use client';
import useSWR from 'swr';
import { useState } from 'react';
import { Card, Button, Input } from '@/components/Ui';
const fetcher = (url:string)=>fetch(url).then(r=>r.json());
export default function RulesPage(){
  const { data, mutate } = useSWR('/api/rules/list', fetcher);
  const [name,setName] = useState('');
  const [priority,setPriority] = useState(100);
  const [conf,setConf] = useState('{"match": {"from": ["noreply@example.com"]}, "actions": [{"move_to_folder":"Junk"}] }');
  async function save(){
    await fetch('/api/rules/upsert', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ name, priority, json_conf: JSON.parse(conf) })});
    setName(''); setConf(''); mutate();
  }
  async function apply(){ await fetch('/api/rules/apply', { method:'POST' }); }
  return (
    <div className="space-y-4">
      <Card title="Regeln">
        <ul className="text-sm space-y-1">
          {data?.items?.map((r:any)=>(<li key={r.id}><span className="font-medium">[{r.priority}] {r.name}</span> <code className="text-xs">{JSON.stringify(r.json_conf)}</code></li>))}
        </ul>
      </Card>
      <Card title="Neue Regel">
        <div className="grid gap-2">
          <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <Input placeholder="Priorität" value={priority} onChange={e=>setPriority(parseInt(e.target.value)||100)} />
          <textarea className="border rounded-xl p-2 min-h-[160px]" value={conf} onChange={e=>setConf(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={save}>Speichern</Button>
            <Button onClick={apply}>Regeln jetzt anwenden</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

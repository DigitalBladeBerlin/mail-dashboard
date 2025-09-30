'use client';
export function Card(props:{ title:string; children:React.ReactNode }){
  return <div className="rounded-2xl shadow p-4 border"><h3 className="font-semibold mb-2">{props.title}</h3><div>{props.children}</div></div>;
}
export function Button(props:React.ButtonHTMLAttributes<HTMLButtonElement>){
  return <button {...props} className={ 'px-3 py-2 rounded-xl border shadow-sm ' + (props.className||'') }/>;
}
export function Input(props:React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={ 'px-3 py-2 rounded-xl border w-full ' + (props.className||'') }/>;
}

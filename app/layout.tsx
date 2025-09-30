export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="de"><body className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mail Dashboard</h1>
        <nav className="flex gap-4 text-sm"><a href="/">Dashboard</a><a href="/inbox">Inbox</a><a href="/settings/rules">Regeln</a></nav>
      </header>
      {children}
    </body></html>
  );
}

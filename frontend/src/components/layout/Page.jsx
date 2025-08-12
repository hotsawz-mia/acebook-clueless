export default function Page({ title, actions = null, children, className = "" }) {
    return (
      <div className="min-h-dvh bg-zinc-950 text-zinc-100">
        {/* top bar (optional; keep empty for now) */}
        <header className="border-b border-zinc-900/80">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            {actions}
          </div>
        </header>
  
        {/* main content */}
        <main className={`container mx-auto px-4 py-6 ${className}`}>
          {children}
        </main>
  
        {/* footer (optional) */}
        <footer className="mt-10 border-t border-zinc-900/80">
          <div className="container mx-auto px-4 py-6 text-xs text-zinc-500">
            © {new Date().getFullYear()} Clueless Acebook
          </div>
        </footer>
      </div>
    );
  }
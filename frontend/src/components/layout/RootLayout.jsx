import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900/80">
        <div className="container px-4 h-14 flex items-center">
          <h1 className="text-lg font-semibold">Your App</h1>
        </div>
      </header>

      {/* Main */}
      <main className="container px-4 py-6">
        <Outlet /> {/* current page renders here */}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80">
        <div className="container px-4 py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
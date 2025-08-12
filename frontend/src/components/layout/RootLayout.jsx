import { Outlet, Link } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900/80">
        <div className="container px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Clueless Acebook</h1>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-zinc-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/posts" className="text-zinc-300 hover:text-white transition-colors">
              Posts
            </Link>
            <Link to="/users" className="text-zinc-300 hover:text-white transition-colors">
              Users
            </Link>
            <Link to="/profile" className="text-zinc-300 hover:text-white transition-colors">
              My Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container px-4 py-6">
        <Outlet /> {/* current page renders here */}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80">
        <div className="container px-4 py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Clueless Acebook
        </div>
      </footer>
    </div>
  );
}
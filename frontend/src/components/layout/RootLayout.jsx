import { Outlet, Link } from "react-router-dom";
import logoUrl from "../../assets/Favicon.png"; 

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-menace-ink text-menace-cream">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Global Menace Network" className="h-7 w-auto" />
            <h1 className="text-base tracking-wider font-semibold">GLOBAL MENACE NETWORK</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Home</Link>
            <Link to="/posts" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Posts</Link>
            <Link to="/users" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Users</Link>
            <Link to="/profile" className="text-menace-cream/80 hover:text-menace-cream transition-colors">My Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 text-xs text-menace-cream/60">
          © {new Date().getFullYear()} GLOBAL MENACE NETWORK
        </div>
      </footer>
    </div>
  );
}
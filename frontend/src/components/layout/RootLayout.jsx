import { Outlet, Link } from "react-router-dom";
import logoUrl from "../../assets/Favicon.png"; 
import NavBar from "../../components/NavBar";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-menace-ink text-menace-cream">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Global Menace Network" className="h-7 w-auto" />
            <h1 className="text-base tracking-wider font-semibold sm:hidden">GMN</h1>
            <h1 className="hidden sm:block text-base tracking-wider font-semibold">GLOBAL MENACE NETWORK</h1>
          </div>
          <NavBar/>
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
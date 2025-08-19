import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import logoUrl from "../../assets/Favicon.png"; 
import NavBar from "../../components/NavBar";

export default function RootLayout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
  setIsLoggedIn(!!localStorage.getItem("token"));
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}, []);

    return (
    <div className="min-h-dvh bg-menace-ink text-menace-cream">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* logo link */}
              <Link to="/">
              <img 
                src={logoUrl}
                alt="Global Menace Network"
                className="h-7 w-auto transition-all duration-200 hover:scale-105 hover:brightness-125 hover:saturate-200"
              />
            </Link>
            <h1 className="text-base tracking-wider font-semibold sm:hidden">GMN</h1>
            <h1 className="hidden sm:block text-base tracking-wider font-semibold">GLOBAL MENACE NETWORK</h1>
          </div>
           {/* this checks the condition if the user is logged in or not */}
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
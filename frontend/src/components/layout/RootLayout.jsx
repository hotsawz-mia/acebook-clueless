import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import logoUrl from "../../assets/Favicon.png";
import bgVideo from "../../assets/GMN-540-L.mp4"; // or put in /public and use "/GMN-540-L.mp4"
import NavBar from "../../components/NavBar";
import { getUserById } from "../../services/users";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();
  const showHomeBg = pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      getUserById("me", token)
        .then((data) => setUser(data.user))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }

    const handleStorage = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        getUserById("me", token)
          .then((data) => setUser(data.user))
          .catch(() => setUser(null));
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  

  return (
    // CHANGED: added flex + flex-col so header, main, footer stack vertically
    // and flexbox can allocate space correctly
    <div className="min-h-dvh bg-menace-ink text-menace-cream flex flex-col">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src={logoUrl} alt="Global Menace Network" className="h-7 w-auto" />
            </Link>
            <h1 className="font-metal hidden sm:block text-base tracking-wider font-semibold">
              GLOBAL MENACE NETWORK
            </h1>
          </div>
          {/* The navbar now shows the user avatar if logged in */}
          <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
        </div>
      </header>

      {/* CHANGED: replaced hard-coded h-[calc(...)] with flex-1 so main auto-fills 
          all available vertical space between header and footer */}
      <main
        className={`relative overflow-hidden flex-1 ${
          // pathname === "/" ? "" : "container mx-auto px-4 py-6"
          pathname === "/" ? "grid place-items-center" : "container mx-auto px-4 py-6"

        }`}
      >
        {showHomeBg && (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/80" aria-hidden="true" />
          </>
        )}
        <div className="relative">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 text-xs text-menace-cream/60">
          © {new Date().getFullYear()} GLOBAL MENACE NETWORK
        </div>
      </footer>
    </div>
  );
}
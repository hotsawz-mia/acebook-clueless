import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function NavBar({ isLoggedIn, setIsLoggedIn}) {
  return (
    <nav className="navbar flex items-center gap-6 text-sm">
      {isLoggedIn ? (
        <>
          <Link to="/posts" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Feed</Link>
          <Link to="/users" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Users</Link>
          <Link to="/profile" className="text-menace-cream/80 hover:text-menace-cream transition-colors">My Profile</Link>
          <LogoutButton setIsLoggedIn={setIsLoggedIn} />
        </>
      ) : (
        <>
          <Link to="/login" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Login</Link>
          <Link to="/signup" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
import { Link } from "react-router-dom";

function NavBar({ isLoggedIn }) {
    function handleLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage")); // triggers storage event for all listeners
  }
  return (
    <nav className="navbar flex items-center gap-6 text-sm">
      <Link to="/" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Home</Link>
      {isLoggedIn ? (
        <>
          <Link to="/posts" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Feed</Link>
          <Link to="/users" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Users</Link>
          <Link to="/profile" className="text-menace-cream/80 hover:text-menace-cream transition-colors">My Profile</Link>
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
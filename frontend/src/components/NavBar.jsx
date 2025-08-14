import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar flex items-center gap-6 text-sm">
      <Link to="/" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Home</Link>
      <Link to="/posts" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Feed</Link>
      <Link to="/users" className="text-menace-cream/80 hover:text-menace-cream transition-colors">Users</Link>
      <Link to="/profile" className="text-menace-cream/80 hover:text-menace-cream transition-colors">My Profile</Link>
    </nav>
  );
}

export default Navbar;

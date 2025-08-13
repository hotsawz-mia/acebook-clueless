import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar";

import "./HomePage.css";

export function HomePage() {
  return (
    <>
      <Navbar />  {/* Add Navbar at the top */}
      <div className="home">
        <h1>Welcome to Acebook!</h1>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    </>
  );
}


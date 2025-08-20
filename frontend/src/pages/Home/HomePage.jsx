import { Link } from "react-router-dom";
import "./HomePage.css";

import logoUrl from "../../assets/GMN.png"; 

export function HomePage() {
  return (
    <>
      <div className="home max-w-md mx-auto text-center space-y-6">
        <img src={logoUrl} alt="Global Menace Network" className=" w-auto" />
        <h1 className="font-metal text-5xl font-bold">Welcome to the Global Menace Network 😈</h1>
        <p className="text-menace-cream/70">Social… but with a wink.</p>
        <div className="flex flex-col gap-4">
          <Link to="/signup" className="btn-ghost">Sign Up</Link>
          <Link to="/login" className="btn-primary">Log In</Link>
        </div>
      </div>
    </>
  );
}

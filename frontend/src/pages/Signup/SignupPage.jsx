import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />

        <label htmlFor="password" className="label">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        <button role="submit-button" id="submit" type="submit" className="btn-primary w-full">Create account</button>
      </form>
    </div>
  );
}

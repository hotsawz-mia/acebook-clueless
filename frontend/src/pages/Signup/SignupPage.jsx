import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authentication";


export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto space-y-6">
      <h2 className="font-metal text-5xl">Swear Allegiance</h2>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label htmlFor="username" className="label">Evil Alias</label>
            <input
              id="username"
              type="text"
              required
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="label">Secret Oath</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          <button id="submit" type="submit" className="btn-primary w-full">
            Create account
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

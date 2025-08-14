import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authentication";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid place-items-center">
        <div className="card w-full max-w-md p-6 shadow-xl">
          <header className="mb-6">
            <h1 className="text-2xl">Welcome back</h1>
            <p className="mt-1 text-sm text-menace-cream/70">Sign in to continue</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="password" className="label">Password</label>
            <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && (
              <p className="text-sm text-red-400" role="alert">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}


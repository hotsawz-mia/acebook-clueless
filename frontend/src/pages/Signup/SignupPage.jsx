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
        <label htmlFor="email" className="block font-medium">
          Email:
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <label htmlFor="password" className="block font-medium">
          Password:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          role="submit-button"
          id="submit"
          type="submit"
          value="Submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        />
      </form>
    </div>
  );
}
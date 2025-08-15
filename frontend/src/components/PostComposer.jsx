import { useMemo, useState } from "react";
import { createPost } from "../services/posts"; // adjust path if needed

export default function PostComposer({ onCreated, className = "" }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        glyph: ["💥", "😼", "🎉", "🧪", "💣", "⚡️", "🕶️", "🔥"][i % 8],
        x: (Math.random() - 0.5) * 400,   // px spread
        y: (Math.random() - 0.7) * 400,   // upward bias
        rot: Math.random() * 720 - 360,
        dur: 800 + Math.random() * 1200,  // 0.8–2.0s
      })),
    []
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!message.trim()) return setError("Message is required.");
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const created = await createPost(message.trim(), token);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 900);
      setMessage("");
      onCreated?.(created);
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`p-4 relative ${className}`}>
      <style>{`
        @keyframes menace-burst {
          0%   { transform: translate(0px, 0px) scale(0.6) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: var(--end-tf) scale(1) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>

      <label htmlFor="composer-message" className="block text-xl font-bold mb-2">
        Care to unveil your nefarious plans?
      </label>

      <textarea
        id="composer-message"
        rows={4}
        maxLength={280}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe what's on your menacing mind"
        className="input w-full resize-y sm:rows-6 rows-8"
        />

      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="muted">{280 - message.length} left</span>
        {error && <span className="text-red-400">{error}</span>}
      </div>

      <div className="mt-1 flex justify-end gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setMessage("")}
          disabled={submitting || message.length === 0}
        >
          Clear
        </button>
        <button
          type="submit"
          id="submit"
          role="submit-button"
          disabled={submitting || message.trim().length === 0}
          className="btn-primary shadow-menace disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Post"}
        </button>
      </div>

      {celebrating && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute text-5xl"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animation: `menace-burst ${p.dur}ms ease-out forwards`,
                ["--end-tf"]: `translate(${p.x}px, ${p.y}px)`,
                ["--rot"]: `${p.rot}deg`,
              }}
            >
              {p.glyph}
            </span>
          ))}
        </div>
      )}
    </form>
  );
}
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts";

export function CreatePostPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const navigate = useNavigate();

  // Auth gate like FeedPage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!message.trim()) return setError("Message is required.");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await createPost(message.trim(), token);

      // Trigger fun effect, then navigate
      setCelebrating(true);
      setTimeout(() => navigate("/posts"), 900);
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  }

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        glyph: ["💥", "😼", "🎉", "🧪", "💣", "⚡️", "🕶️", "🔥"][i % 8],
        x: (Math.random() - 0.5) * 1800, 
        y: (Math.random() - 0.7) * 1800, 
        rot: Math.random() * 720 - 360,
        dur: 800 + Math.random() * 8000,
      })),
    []
  );

  return (
    <main className="shell relative">
      {/* Local keyframes for the burst */}
      <style>{`
        @keyframes menace-pop {
          0%   { transform: translate(0,0) scale(0.6) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          70%  { opacity: 1; }
          100% {
            transform: var(--end-tf) scale(1) rotate(var(--rot));
            opacity: 0;
          }
        }
      `}</style>

      {/* Sticky header */}
      <div className="sticky top-[64px] z-10 px-4">
        <header className="card glass max-w-3xl mx-auto mt-6 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Create Post</h2>
            <p className="section-subtitle mt-1">
              Share your latest scheme with the network
            </p>
          </div>
          {/* Removed Logout */}
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigate("/posts")}
          >
            Back to Feed
          </button>
        </header>
      </div>

      <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Mobile actions (no logout) */}
        <div className="sm:hidden flex gap-3">
          <button
            type="button"
            className="btn-outline flex-1"
            onClick={() => navigate("/posts")}
          >
            Back
          </button>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-4 relative overflow-hidden">
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={280}
            placeholder="What’s on your menacing mind?"
            className="input w-full resize-y"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="muted">{280 - message.length} characters left</span>
            {error && <span className="text-red-400">{error}</span>}
          </div>

          {/* Right-aligned actions */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/posts")}
            >
              Cancel
            </button>
            <input
              role="submit-button"
              id="submit"
              type="submit"
              value={submitting ? "Submitting..." : "Submit"}
              disabled={submitting || message.trim().length === 0}
              className="btn-primary shadow-menace disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Menacing burst overlay */}
          {celebrating && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="relative h-40 w-40">
                {particles.map((p) => (
                  <span
                    key={p.id}
                    className="absolute text-5xl sm:text-3xl"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      animation: `menace-pop ${p.dur}ms ease-out forwards`,
                      // final transform vector
                      // convert x%/y% to translate relative to wrapper
                      // also add rotation
                      ["--end-tf"]: `translate(${p.x}%, ${p.y}%)`,
                      ["--rot"]: `${p.rot}deg`,
                    }}
                  >
                    {p.glyph}
                  </span>
                ))}
              </div>
            </div>
          )}
        </form>

        <footer className="footer pt-6 text-center">
          <p>© Global Menace Network</p>
        </footer>
      </section>
    </main>
  );
}
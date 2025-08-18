import { useMemo, useState } from "react";
import { createPost } from "../services/posts"; // adjust path if needed

export default function PostComposer({ onCreated, className = "" }) {
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);  // New: photo file state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        glyph: ["💥", "😼", "🎉", "🧪", "💣", "⚡️", "🕶️", "🔥"][i % 8],
        x: (Math.random() - 0.5) * 400,  
        y: (Math.random() - 0.7) * 400,  
        rot: Math.random() * 720 - 360,
        dur: 800 + Math.random() * 1200,  
      })),
    []
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!message.trim() && !photo) {
      return setError("Message or photo is required.");
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // Use FormData to send text + file
      const formData = new FormData();
      formData.append("message", message.trim());
      if (photo) formData.append("photo", photo);

      const created = await createPost(formData, token);  // <-- Updated to send FormData

      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 900);
      setMessage("");
      setPhoto(null);  // Clear photo input
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

      {/* New photo input */}
      <div className="mt-3">
        <label htmlFor="composer-photo" className="block font-semibold mb-1">Attach a photo:</label>
        <input
          id="composer-photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          disabled={submitting}
        />
        {photo && <p className="mt-1 text-sm">Selected file: {photo.name}</p>}
      </div>

      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="muted">{280 - message.length} left</span>
        {error && <span className="text-red-400">{error}</span>}
      </div>

      <div className="mt-1 flex justify-end gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => { setMessage(""); setPhoto(null); }}
          disabled={submitting && message.length === 0 && !photo}
        >
          Clear
        </button>
        <button
          type="submit"
          id="submit"
          role="submit-button"
          disabled={submitting || (!message.trim() && !photo)}
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

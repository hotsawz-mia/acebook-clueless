import { useMemo, useState, useEffect, useRef } from "react";
import { createPost } from "../services/posts";

export default function PostComposer({ onCreated, className = "" }) {
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);  // New: photo file state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  // compacting logic
  const [scrolledDown, setScrolledDown] = useState(false);
  const [active, setActive] = useState(false);
  const scrollHandlerRef = useRef(null);
  const textareaRef = useRef(null);

  // Compact only when scrolled, not active (no focus within), and empty
  const compact = scrolledDown && !active && message.length === 0;

  useEffect(() => {
    const THRESHOLD = 100;
    const onScroll = () => setScrolledDown(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollHandlerRef.current = onScroll;
    return () => {
      if (scrollHandlerRef.current)
        window.removeEventListener("scroll", scrollHandlerRef.current);
    };
  }, []);

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

    <form
      onSubmit={handleSubmit}
      className={`p-4 relative ${className}`}
      aria-expanded={!compact}
      onFocus={() => setActive(true)}           // any focus inside keeps it active
      onBlur={(e) => {                          // collapse only when focus leaves the form entirely
        const next = e.relatedTarget;
        if (!e.currentTarget.contains(next)) setActive(false);
      }}
      onClick={() => {                          // tapping anywhere opens and focuses textarea
        setActive(true);
        if (textareaRef.current) textareaRef.current.focus();
      }}
    >
      <style>{`
        @keyframes menace-burst {
          0%   { transform: translate(0px, 0px) scale(0.6) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: var(--end-tf) scale(1) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>


      <label
        htmlFor="composer-message"
        className={`block font-bold mb-2 transition-all duration-200 ${
          compact ? "text-base opacity-80" : "text-xl opacity-100"
        }`}
      >

        Care to unveil your nefarious plans?

      </label>

      {/* Textarea height animates via min-height */}
      <textarea
        id="composer-message"
        ref={textareaRef}
        maxLength={280}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe what's on your menacing mind"
        className="input w-full resize-y"
        style={{
          minHeight: compact ? 44 : 160, // px
          transition: "min-height 220ms ease, box-shadow 200ms ease",
        }}
      />

      <div
        className="mt-3"
        style={{
          maxHeight: compact ? 0 : 72,
          opacity: compact ? 0 : 1,
          transform: compact ? "translateY(-6px)" : "translateY(0)",
          overflow: "hidden",
          transition:
            "max-height 260ms ease, opacity 200ms ease, transform 200ms ease",
          pointerEvents: compact ? "none" : "auto",
        }}
        aria-hidden={compact}
      >
        <label className="block font-semibold mb-1">Attach a photo:</label>
        <div className="flex items-center gap-3">
          {/* visually hidden input */}
          <input
            id="composer-photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            disabled={submitting}
            className="sr-only"
          />
          <label
            htmlFor="composer-photo"
            className="btn-ghost cursor-pointer select-none"
            tabIndex={0}
          >
            {photo ? "Change file" : "Choose file"}
          </label>
          <span className="text-sm muted truncate max-w-[55%]">
            {photo ? photo.name : "No file selected"}
          </span>
        </div>
      </div>

      {/* Counter + errors (fade/slide & height collapse) */}
      <div
        style={{
          maxHeight: compact ? 0 : 48,
          opacity: compact ? 0 : 1,
          transform: compact ? "translateY(-6px)" : "translateY(0)",
          overflow: "hidden",
          transition:
            "max-height 240ms ease, opacity 180ms ease, transform 180ms ease",
        }}
        className="mt-1 flex items-center justify-between text-sm"
        aria-hidden={compact}
      >
        <span className="muted">{280 - message.length} left</span>
        {error && <span className="text-red-400">{error}</span>}
        <div className="mt-2 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => { setMessage(""); setPhoto(null); }}
          disabled={submitting}
        >
          Clear
        </button>
        <button
          type="submit"
          id="submit"
          role="submit-button"
          disabled={submitting || (!message.trim() && !photo)}
          className="btn-primary shadow-menace disabled:opacity-60 disabled:cursor-not-allowed flicker"
        >
          {submitting ? "Submitting..." : "Post"}
        </button>
      </div>
      </div>

      {/* Buttons (same animation) */}
      

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

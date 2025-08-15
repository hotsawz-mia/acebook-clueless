import { useEffect, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);
  const [timer, setTimer] = useState(null);

  function showToast(message, type = "success", duration = 3000) {
    if (timer) clearTimeout(timer);
    setToast({ message, type, duration, id: crypto.randomUUID() });
    const t = setTimeout(() => setToast(null), duration);
    setTimer(t);
  }

  function Toast() {
    if (!toast) return null;

    const palette = {
      success: "from-emerald-400 to-lime-400",
      error: "from-rose-500 to-orange-500",
      info: "from-sky-400 to-indigo-400",
      menace: "from-fuchsia-500 to-emerald-400",
    };

    const icon = {
      success: "☠️",
      error: "💣",
      info: "🛰️",
      menace: "😼",
    }[toast.type] ?? "☠️";

    return (
      <>
        {/* Local menace animations */}
        <style>{`
          @keyframes menace-flicker {
            0%, 100% { opacity: 1 }
            92% { opacity: .9 }
            94% { opacity: .65 }
            96% { opacity: .95 }
            98% { opacity: .7 }
          }
          @keyframes menace-shake {
            0%,100% { transform: translate(0,0) }
            25% { transform: translate(-10px,10px) }
            50% { transform: translate(10px,-1px) }
            75% { transform: translate(-0.5px,0.5px) }
          }
          @keyframes menace-progress {
            from { width: 100% }
            to { width: 0% }
          }
          .menace-shadow {
            box-shadow:
              0 0 12px rgba(198, 50, 38, .35),
              0 0 24px rgba(228, 214, 195, .25);
          }
        `}</style>

        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 max-w-sm select-none"
        >
          <div
            className={[
              "relative rounded-xl border border-white/10 backdrop-blur",
              "bg-zinc-900/80 text-white px-4 py-3 menace-shadow",
              "animate-[menace-flicker_2.2s_infinite_linear]",
            ].join(" ")}
          >
            {/* Glow ring */}
            <div
              className={[
                "absolute -inset-0.5 rounded-xl blur-sm opacity-60",
                "bg-gradient-to-r",
                palette[toast.type] ?? palette.menace,
              ].join(" ")}
              aria-hidden="true"
            />
            {/* Card content */}
            <div className="relative flex items-start gap-3 animate-[menace-shake_600ms_ease-in-out_1]">
              <div className="text-2xl leading-none">{icon}</div>
              <div className="flex-1">
                <p className="text-sm leading-snug">{toast.message}</p>
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => setToast(null)}
                className="ml-2 text-white/70 hover:text-white transition"
              >
                ×
              </button>
            </div>

            {/* Progress bar */}
            <div className="relative mt-3 h-1 w-full overflow-hidden rounded">
              <div className="absolute inset-0 bg-white/10" />
              <div
                className={[
                  "relative h-full bg-gradient-to-r",
                  palette[toast.type] ?? palette.menace,
                ].join(" ")}
                style={{
                  animation: `menace-progress ${toast.duration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // cleanup on unmount
  useEffect(() => () => timer && clearTimeout(timer), [timer]);

  return { showToast, Toast };
}
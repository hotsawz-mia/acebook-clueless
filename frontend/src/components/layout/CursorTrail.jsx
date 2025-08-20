import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const raf = useRef();

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px";
      c.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener("resize", resize);

    let last = performance.now();
    function tick(t) {
      const dt = Math.min(32, t - last); // cap delta
      last = t;

      // clear the canvas each frame so background stays transparent
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      // draw points
      ctx.globalCompositeOperation = "lighter"; // glowing effect
      for (const p of points.current) {
        p.life -= dt;
        if (p.life <= 0) continue;
        const alpha = p.life / p.maxLife;
        const r = p.baseR * (1 + (1 - alpha) * 0.6);

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(180,0,40,${0.25 * alpha})`);
        g.addColorStop(1, `rgba(120,0,80,0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // keep only live points
      points.current = points.current.filter((p) => p.life > 0);

      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    function onMove(e) {
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < 2; i++) {
        points.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          baseR: 8 + Math.random() * 14,
          life: 600 + Math.random() * 300, // ms
          maxLife: 900,
        });
      }
    }

    addEventListener("pointermove", onMove, { passive: true });

    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none", // ensure site stays clickable
      }}
      aria-hidden="true"
    />
  );
}
import { useEffect, useState } from "react";

export default function DripEffect() {
  const [drips, setDrips] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 100; // vw
      const duration = 5 + Math.random() * 3; // seconds
      setDrips((d) => [...d, { id, left, duration }]);
      setTimeout(() => setDrips((d) => d.filter((drip) => drip.id !== id)), duration * 1000);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {drips.map(({ id, left, duration }) => (
        <div
          key={id}
          className="drip"
          style={{ left: `${left}vw`, animationDuration: `${duration}s` }}
        />
      ))}
    </div>
  );
}
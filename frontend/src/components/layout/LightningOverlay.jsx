import { useMemo } from "react";
export default function LightningOverlay() {
  const delay = useMemo(() => `${Math.random() * 8}s`, []);
  return <div className="lightning-global" style={{ animationDelay: delay }} />;
}
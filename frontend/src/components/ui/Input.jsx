import { forwardRef } from "react";

const base =
  "h-11 w-full rounded-lg border bg-zinc-950 px-3 text-zinc-100 " +
  "outline-none transition focus:ring-2 focus:ring-indigo-500/30 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const normalBorder = "border-zinc-800 focus:border-indigo-500";
const errorBorder  = "border-red-700/60 focus:border-red-500/70 focus:ring-red-500/25";

const Input = forwardRef(function Input(
  { className = "", error = false, ...props },
  ref
) {
  const cls = [base, error ? errorBorder : normalBorder, className].join(" ");
  return <input ref={ref} className={cls} aria-invalid={error || undefined} {...props} />;
});

export default Input;
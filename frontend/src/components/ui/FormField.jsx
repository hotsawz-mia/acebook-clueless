export default function FormField({ id, label, help, error, children }) {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="text-sm text-zinc-300">
            {label}
          </label>
        )}
        {children}
        {error ? (
          <div className="rounded-md border border-red-700/40 bg-red-900/20 px-3 py-2 text-sm text-red-300" role="alert">
            {error}
          </div>
        ) : help ? (
          <div className="text-xs text-zinc-400">{help}</div>
        ) : null}
      </div>
    );
  }
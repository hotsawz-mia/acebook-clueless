export default function Button({ as: Tag = "button", className = "", ...props }) {
    return (
      <Tag
        className={
          "inline-flex h-11 items-center justify-center rounded-lg px-4 font-medium " +
          "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 " +
          className
        }
        {...props}
      />
    );
  }
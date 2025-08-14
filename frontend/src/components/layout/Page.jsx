// export default function Page({ title, actions = null, children, className = "" }) {
//   return (
//     <div className="min-h-dvh bg-menace-ink text-menace-cream">
//       {/* top bar */}
//       <header className="border-b border-white/10">
//         <div className="container mx-auto px-4 h-14 flex items-center justify-between">
//           <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
//           {actions}
//         </div>
//       </header>

//       {/* main content */}
//       <main className={`container mx-auto px-4 py-6 ${className}`}>{children}</main>

//       {/* footer */}
//       <footer className="mt-10 border-t border-white/10">
//         <div className="container mx-auto px-4 py-6 text-xs text-menace-cream/60">
//           © {new Date().getFullYear()} Global Menace Network
//         </div>
//         <div className="probe">tailwind probe</div>
//       </footer>
//     </div>
//   );
// }

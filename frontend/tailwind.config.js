/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        menace: {
          cream: "#E4D6C3",
          red: "#C63226",
          ink: "#0D110C",
        },
      },
      boxShadow: {
        menace: "0 10px 30px -10px rgba(198, 50, 38, 0.45)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        metal: ['"Metal Mania"', 'cursive'], 
      },
      container: { center: true, padding: "1rem" },
    },
  },
  plugins: [],
};


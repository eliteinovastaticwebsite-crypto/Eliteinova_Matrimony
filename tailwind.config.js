/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        brand: {
          red: "#dc2626", 
          yellow: "#facc15", 
        },
      },
      fontFamily: {
        pacifico: ["PacificoLocal", "cursive"],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

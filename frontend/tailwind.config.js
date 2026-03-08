/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        brand: { DEFAULT: "#7c3aed", light: "#a855f7", dark: "#5b21b6" },
        surface: { DEFAULT: "#07070f", card: "#0d0d1a", border: "rgba(255,255,255,0.08)" },
      },
    },
  },
  plugins: [],
};

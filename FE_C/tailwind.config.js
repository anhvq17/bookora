/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        impact: ["ImpactVN", "Impact", "Anton", "Oswald", "Arial Black", "sans-serif"],
        allura: ["Allura", "cursive"],
      },
    },
  },
  plugins: [],
};

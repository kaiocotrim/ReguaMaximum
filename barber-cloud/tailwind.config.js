// tailwind.config.js (ou .ts)
module.exports = {
  darkMode: "class", // ← isso é essencial
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#7f13ec",
        "primary-dark": "#5e0eb3",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "panel-light": "#ffffff",
        "panel-dark": "#1f142b",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

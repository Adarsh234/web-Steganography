/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FAF8F5",
          limestone: "#F0E6D8",
          terracotta: "#B5543A",
          olive: "#6F7F5F",
          rust: "#5A2E25",
        }
      },
      fontFamily: {
        display: ['"Gunken"', '"Inklab"', '"Odida"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
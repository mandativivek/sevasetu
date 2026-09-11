/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#7228a8ff",
          teal: "#0E7C7B",
          saffron: "#e98409ff",
          bg: "#F5F7FA",
        },
      },
    },
  },
  plugins: [],
}

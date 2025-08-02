/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts}"], // Optional: Explicit paths if auto-detection isn't sufficient
  theme: {
    extend: {
      fontFamily: {
        display: ["Libertinus Serif", "serif"],
      },
    },
  },
  plugins: [],
};

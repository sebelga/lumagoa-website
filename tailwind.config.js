/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/index.ejs",
    "./src/pages/terms-and-services.ejs",
    "./src/partials/**/*.{html,js,ts, ejs}",
    "./src/**/*.{html,js,ts,ejs}",
  ], // Optional: Explicit paths if auto-detection isn't sufficient
  theme: {
    extend: {
      fontFamily: {
        display: ["Libertinus Serif", "serif"],
      },
    },
  },
  plugins: [],
};

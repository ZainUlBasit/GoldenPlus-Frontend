/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        dacingscript: ["Dancing Script", "cursive"],
        exo2: ["Exo 2", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        alegreya: ["Alegreya Sans SC", "sans-serif"],
      },
    },
  },
  plugins: [],
};

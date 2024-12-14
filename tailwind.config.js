/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      max750: { max: "750px" },
      max480: { max: "480px" },
      max300: { max: "300px" },
      min300: "min-300px",
    },
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

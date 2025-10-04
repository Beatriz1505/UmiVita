/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F3F3F3",
        blue: "#59CDFF",
        green: "#5ADB62",
      },
      fontFamily: {
        title: ["Alatsi", "sans-serif"],
        text: ["Albert Sans", "sans-serif"],
      },
      borderRadius: {
        big: "50px",
        card: "20px",
        dropdown: "30px",
        circle: "50%",
      },
      boxShadow: {
        umivita: "7px 7px 20px 0 rgba(0,0,0,0.25)"
      }
    },
  },
  plugins: [],
}

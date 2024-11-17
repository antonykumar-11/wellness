/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1400px",
    },
    extend: {
      colors: {
        sectionColor: "hsl(209, 100%, 97%)",
        darkBodyColor: "hsl(216, 100%, 4%)",
        darkSectionColor: "hsl(211, 100%, 12%)",
        primaryColor: "hsl(209, 87%, 21%)",
        primaryColorLight: "hsl(209, 74%, 45%)",
        whiteColor: "#fff",
        textColor: "#DDD",
        secondaryColor: "red",
      },
      keyframes: {
        move: {
          "50%": { transform: "scale(1.1)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        scaleAnimation: "move 3s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        londrina: ["Londrina Outline", "sans-serif"],
        quickSand: ["Quicksand", "sans-serif"],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "10px",
        md: "30px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#0f0f0f",
        subMain: "#a046f0",
        dry: "#1c1c1c",
        star: "#FFB000",
        text: "#e1e1e1",
        myWhite: "#f1f1f1",
        border: "#4B5563",
        dryGray: "#f1f1f1",
        lightDark: "#383838",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
      fontFamily: { movie: ["Orbitron", "sans-serif"] },
    },
    screens: {
      xs: "480px", // Extra small (phones in portrait)
      sm: "640px", // Small (phones landscape / small tablets)
      md: "768px", // Medium (tablets)
      lg: "1024px", // Large (small laptops)
      xl: "1280px", // Extra large (desktops)
      "2xl": "1536px", // 2XL (large desktops / monitors)
    },
  },
  plugins: [daisyui],
};

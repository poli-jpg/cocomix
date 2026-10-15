import type { Config } from "tailwindcss";

/*
 * Palette Cocomix v2 : base noir & blanc nette, et une couleur vive par saveur.
 * Les noms de tokens (cream, cocoa, leaf, gold) sont conservés pour l'admin,
 * mais leurs valeurs sont neutres : l'accent vient des saveurs.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FAFAF7", 100: "#F3F2EE", 200: "#E7E5DF" },
        cocoa: { DEFAULT: "#15110D", 700: "#2B251F", 500: "#6E665E", 300: "#AAA39A" },
        leaf: { DEFAULT: "#15110D", 600: "#000000", 100: "#EFEDE8", 50: "#F6F5F1" },
        gold: { DEFAULT: "#FFB800", 100: "#FFF1C7" },
        ink: "#15110D",
        lait: { DEFAULT: "#F7C77E", soft: "#FFF0D6", deep: "#8A4E12" },
        menthe: { DEFAULT: "#2FD48A", soft: "#D6FBE8", deep: "#065F3B" },
        gingembre: { DEFAULT: "#FF7A2F", soft: "#FFE3D2", deep: "#8C2C00" },
        ananas: { DEFAULT: "#FFD43B", soft: "#FFF6CC", deep: "#7A5A00" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(21,17,13,.04), 0 8px 24px -10px rgba(21,17,13,.14)",
        lift: "0 2px 4px rgba(21,17,13,.06), 0 30px 60px -20px rgba(21,17,13,.30)",
        pop: "6px 6px 0 0 #15110D",
      },
      borderRadius: { xl2: "1.25rem", "4xl": "2rem" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        wobble: { "0%,100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        bump: { "0%": { transform: "scale(1)" }, "40%": { transform: "scale(1.35)" }, "100%": { transform: "scale(1)" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-fast": "marquee 18s linear infinite",
        wobble: "wobble 3s ease-in-out infinite",
        bump: "bump .45s cubic-bezier(.3,1.6,.5,1)",
      },
    },
  },
  plugins: [],
};
export default config;

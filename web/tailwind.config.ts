import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#F5F0E6",
        accent: {
          DEFAULT: "#7D6B52",
          dark: "#5C4D3A",
          soft: "#A08E72",
        },
        ink: "#2A2622",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgb(42 38 34 / 0.08), 0 8px 32px -8px rgb(42 38 34 / 0.06)",
        lift: "0 12px 40px -12px rgb(42 38 34 / 0.12), 0 4px 16px -4px rgb(42 38 34 / 0.08)",
        nav: "0 1px 0 rgb(245 240 230 / 0.9), 0 12px 32px -12px rgb(42 38 34 / 0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(1.125rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "hero-reveal": {
          "0%": { opacity: "0", transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "hero-pan": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "line-grow": {
          "0%": { opacity: "0", transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { opacity: "1", transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.7s ease-out forwards",
        "hero-reveal": "hero-reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "hero-pan": "hero-pan 14s ease-out forwards",
        "line-grow": "line-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;

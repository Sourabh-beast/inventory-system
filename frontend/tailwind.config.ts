import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        /* Surface layers */
        surface: {
          0: "#09090F",   /* page */
          1: "#0C0C14",   /* sidebar */
          2: "#0F0F18",   /* card */
          3: "#141420",   /* elevated card */
          4: "#1A1A28",   /* modal */
        },
        /* Border layers */
        line: {
          1: "rgba(255,255,255,0.05)",
          2: "rgba(255,255,255,0.08)",
          3: "rgba(255,255,255,0.12)",
          accent: "rgba(99,102,241,0.4)",
        },
        /* Brand */
        brand: {
          DEFAULT: "#6366F1",
          dim: "rgba(99,102,241,0.12)",
          glow: "rgba(99,102,241,0.25)",
        },
        /* Semantic */
        success: { DEFAULT: "#10B981", dim: "rgba(16,185,129,0.12)" },
        warning: { DEFAULT: "#F59E0B", dim: "rgba(245,158,11,0.12)" },
        danger:  { DEFAULT: "#EF4444", dim: "rgba(239,68,68,0.12)"  },
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)",
        "modal": "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.15)",
        "glow-md": "0 0 40px rgba(99,102,241,0.2)",
        "input-focus": "0 0 0 2px rgba(99,102,241,0.3)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in":  "fade-in  0.2s ease forwards",
        "slide-up": "slide-up 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
        "scale-in": "scale-in 0.2s cubic-bezier(0.4,0,0.2,1) forwards",
        "count-up": "count-up 0.3s cubic-bezier(0.4,0,0.2,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;

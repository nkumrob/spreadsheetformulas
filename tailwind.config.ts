import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        cream: "#F3EEE4",
        ink: {
          DEFAULT: "#1C1A16",
          soft: "#4A463E",
          faint: "#8A8476",
        },
        ledger: {
          DEFAULT: "#166B4A",
          deep: "#0E4A33",
          tint: "#E4F0E9",
          bright: "#1E8A5F",
        },
        rust: {
          DEFAULT: "#B3402E",
          tint: "#F6E6E2",
        },
        gold: {
          DEFAULT: "#B07C24",
          tint: "#F5ECD9",
        },
        rule: "#DCD5C7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        cell: "0 1px 0 0 #DCD5C7, inset 0 0 0 1px #DCD5C7",
        lift: "0 1px 2px rgba(28,26,22,0.06), 0 8px 24px -8px rgba(28,26,22,0.14)",
        bar: "0 1px 2px rgba(28,26,22,0.05), 0 2px 8px -2px rgba(28,26,22,0.08)",
      },
      maxWidth: {
        page: "72rem",
        prose: "44rem",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0b1f3a",
        gold: "#f2a900",
        crimson: "#c1121f",
        cream: "#faf7f2",
        sage: "#2d6a4f",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      fontSize: {
        "body": ["17px", { lineHeight: "1.75" }],
      },
      letterSpacing: {
        "display": "-0.02em",
      },
      boxShadow: {
        card: "0 2px 16px rgba(11,31,58,0.06)",
      },
      borderColor: {
        card: "#e8e4de",
      },
    },
  },
  plugins: [],
};
export default config;

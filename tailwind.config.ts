import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        anthracite: "#121212",
        gold: "#D4AF37",
        ivory: "#F5F5F5",
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#121212",
        },
      },
    },
  },
  plugins: [],
};
export default config;

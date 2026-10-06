import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#99f6e0",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          teal: "#06b6d4",
          primary: "#14b8a6",
          accent: "#ff6b4a",
          mentorsGreen: "#22c55e",
        },
        darkbg: {
          900: "#0f0f11",
          800: "#161619",
          700: "#1f1f23",
          600: "#2a2a30",
          500: "#36363d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-mentoree": "radial-gradient(at 0% 0%, rgba(204, 251, 241, 0.6) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.7) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(240, 253, 250, 0.9) 0px, transparent 50%)",
        "dark-mesh": "radial-gradient(at 90% 10%, rgba(34, 197, 94, 0.12) 0px, transparent 40%), radial-gradient(at 10% 20%, rgba(245, 158, 11, 0.08) 0px, transparent 40%), radial-gradient(at 50% 80%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

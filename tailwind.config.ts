import type { Config } from "tailwindcss";
import { palette } from "./lib/palette";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          dark: '#0f0f1a',
          light: '#2a2a4f',
        },
        accent: {
          DEFAULT: '#e94560',
          hover: '#ff6b81',
        },
        gold: '#ffd700',
        /** Paleta para Home y páginas públicas (lib/palette.ts) */
        palette: {
          background: {
            primary: palette.background.primary,
            secondary: palette.background.secondary,
            dark: palette.background.dark,
          },
          accent: {
            DEFAULT: palette.accent.DEFAULT,
            hover: palette.accent.hover,
            light: palette.accent.light,
          },
          text: {
            primary: palette.text.primary,
            secondary: palette.text.secondary,
            inverse: palette.text.inverse,
          },
          border: {
            light: palette.border.light,
            DEFAULT: palette.border.DEFAULT,
            dark: palette.border.dark,
          },
          icon: {
            placeholder: palette.icon.placeholder,
            primary: palette.icon.primary,
          },
          brand: {
            youtube: palette.brand.youtube,
            youtubeDark: palette.brand.youtubeDark,
          },
        },
        /** Login / auth (diseño ChainSight) */
        'auth-bg': '#0B1F2D',
        'smoke-white': '#F8FAFC',
        'emerald-custom': '#1F7A5C',
        'emerald-hover': '#00E676',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

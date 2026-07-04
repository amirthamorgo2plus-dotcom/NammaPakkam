import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, friendly community palette
        brand: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff8a4c',
          500: '#ff5a1f',
          600: '#d03801',
          700: '#b43403',
          800: '#8a2c0d',
          900: '#73230d',
        },
        sand: {
          50: '#faf7f2',
          100: '#f2ece1',
          200: '#e4d8c5',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Noto Sans Tamil', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

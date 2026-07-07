import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soft, feminine "women's theme" palette — rose/berry + lavender + blush.
        brand: {
          50: '#fdf4f7',
          100: '#fbe3ec',
          200: '#f6c6da',
          300: '#ee9fbd',
          400: '#e27aa0',
          500: '#c85680', // primary — berry rose
          600: '#b0426a',
          700: '#8f3355',
          800: '#742a44',
          900: '#5f2438',
        },
        // Lavender/violet secondary
        lav: {
          50: '#f6f3fa',
          100: '#ece7f3',
          200: '#d9cfe8',
          300: '#c3b3da',
          400: '#a98fc7',
          500: '#9575b3',
          600: '#7d5c9b',
        },
        // Blush-cream neutrals (backgrounds / borders)
        sand: {
          50: '#fbf6f8',
          100: '#f5eaf0',
          200: '#e9d5df',
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

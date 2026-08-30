import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nfcu: {
          navy: '#0B3D6E',
          'navy-light': '#1a5490',
          'navy-dark': '#082d52',
          orange: '#E87722',
          'orange-hover': '#D06A1E',
          'light-blue': '#E8F4FC',
          'link-blue': '#0073A8',
          'border-gray': '#D1D5DB',
          'text-gray': '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
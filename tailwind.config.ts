import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-color': 'rgb(var(--bg-color) / <alpha-value>)',
        brand: {
          brown: 'rgb(var(--brand-brown) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          cream: 'rgb(var(--brand-cream) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
          darkCream: 'rgb(var(--brand-darkCream) / <alpha-value>)',
          green: 'rgb(var(--brand-green) / <alpha-value>)',
          text: 'rgb(var(--brand-text) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
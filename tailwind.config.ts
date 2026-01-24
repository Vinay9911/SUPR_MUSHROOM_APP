import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: '#bc6c25',
          dark: '#8b4513',
          cream: '#faedcd',
          light: '#fefae0',
          darkCream: '#e9dcc4',
          green: '#18b918',
          text: '#2d2d2d',
          muted: '#666666',
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
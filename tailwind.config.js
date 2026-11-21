/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#193A32',
          deep: '#102A24',
          light: '#234e44',
          dark: '#0c201b',
        },
        ivory: {
          DEFAULT: '#F7F5EF',
          soft: '#FAF9F5',
          dark: '#EFECE2',
        },
        sand: {
          DEFAULT: '#E7DFD1',
          light: '#F0ECE4',
          dark: '#D5C9B5',
        },
        bronze: {
          DEFAULT: '#AD8B61',
          light: '#C4A47C',
          dark: '#8C6C43',
        },
        charcoal: {
          DEFAULT: '#222622',
          light: '#353B35',
          dark: '#161916',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.2em',
        'widest-plus': '0.25em',
      }
    },
  },
  plugins: [],
}

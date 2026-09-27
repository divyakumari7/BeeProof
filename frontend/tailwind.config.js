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
          950: '#07160D',
          900: '#0D2818',
          800: '#163824',
          700: '#1E4C31',
          600: '#2A6844',
          500: '#388659',
          100: '#E4EFE8',
          50: '#F2F7F4',
        },
        honey: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
          300: '#FCD34D',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#EAE1D7',
          300: '#D8C8B8',
          800: '#3D342C',
          900: '#261F18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

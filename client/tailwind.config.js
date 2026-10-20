/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Vibrant Warm Amber
          600: '#ea580c', // Warm Terracotta
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        sand: {
          50: '#fffbf5',
          100: '#fdf7ee',
          200: '#f5ebdb',
          300: '#e8dbca',
          800: '#4a3e35',
          900: '#2c241e'
        },
        forest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(120, 80, 50, 0.08)',
        hover: '0 10px 25px -4px rgba(120, 80, 50, 0.12)',
        card: '0 2px 12px rgba(44, 36, 30, 0.05)',
      }
    },
  },
  plugins: [],
}

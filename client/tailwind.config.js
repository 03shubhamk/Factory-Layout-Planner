/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#1E293B',
          dark: '#0F172A',
          light: '#334155',
        },
        customBg: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        'custom': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 41, 59, 0.05), 0 2px 4px -1px rgba(30, 41, 59, 0.03)',
        'premium': '0 10px 30px -10px rgba(30, 41, 59, 0.1), 0 1px 3px rgba(30, 41, 59, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

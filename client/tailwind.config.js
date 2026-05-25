/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E8B57',
        secondary: '#4A90E2',
        accent: '#FFA94D',
        ink: '#333333',
        surface: '#F8FAFC',
      },
      boxShadow: {
        soft: '0 18px 48px rgba(16, 24, 40, 0.10)',
        card: '0 14px 32px rgba(30, 41, 59, 0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.65s ease both',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(18px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};


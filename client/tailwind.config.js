/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        background: 'var(--background-color)',
        text: 'var(--text-color)',
        error: 'var(--error-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-delay-1': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '30%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-delay-2': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '60%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-delay-3': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '80%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-delay-1': 'fade-in-delay-1 0.8s ease-out forwards',
        'fade-in-delay-2': 'fade-in-delay-2 1s ease-out forwards',
        'fade-in-delay-3': 'fade-in-delay-3 1.2s ease-out forwards',
      },
    },
  },
  future: {
    enableAllFeatures: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 
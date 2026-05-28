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
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#85a4ff',
          500: '#5B7CFA', // Main Royal Blue
          600: '#4864e0',
          700: '#364bc7',
          800: '#2433ad',
          900: '#121a94',
        },
        beige: '#F5F0E8', // Main Beige/Cream
        darkBg: '#1F2937',
        darkCard: '#374151',
        glassBg: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        premium: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

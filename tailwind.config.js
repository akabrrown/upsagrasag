/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366', // UPSA dark blue
        accent: '#B8860B', // UPSA gold
        body: '#333333', // Dark gray for body text
        border: '#C8C8C8', // Light gray for UI borders
        muted: '#6B7280', // Tailwind gray-500 for secondary text
        error: '#DC2626', // Tailwind red-600 for error messages
        link: '#2563EB', // Tailwind blue-600 for links
        background: {
          DEFAULT: '#FFFFFF', // White
          lightBlue: '#D6E4F0', // Light blue
          lightGold: '#F5E6B3', // Light gold
        },
        neutral: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['"Giga Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3949AB',
          dark: '#283593',
          light: '#E8EAF6',
        },
        secondary: {
          DEFAULT: '#00897B',
          dark: '#00695C',
          light: '#E0F2F1',
        },
        bg: '#F5F6FA',
        surface: '#FFFFFF',
        textPrimary: '#212121',
        textSecondary: '#616161',
        borderMd: '#E0E4EC',
      },
    },
  },
  plugins: [],
};

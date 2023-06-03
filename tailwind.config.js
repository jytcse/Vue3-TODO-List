/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.2s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%' :{
            transform: 'translateX(0px)',
          },
          '25%' :{
            transform: 'translateX(-5px)',
          },
            '50%' :{
            transform: 'translateX(0px)',
          },
          '75%': {
            transform: 'translateX(5px)',
          },
          '100%' :{
            transform: 'translateX(0px)',
          },
        }
      }

    },
  },
  plugins: [],
}


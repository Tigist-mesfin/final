/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 
  theme: {
    extend: {
    
      colors: {
       
        'Hex':'#7E5936',
        'Hex2':'#BFBAC2',
        'Hex3':'#D8C3B4',
        'Hex4':'#D1A791',
        'Hex44':'#441306',

        'Hex5':'#A96F44',
        'Hex1':'#C0B2A4',

      },
      animation: {
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
      },
      keyframes: {
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
      },
    },
  },
  plugins: [],
}


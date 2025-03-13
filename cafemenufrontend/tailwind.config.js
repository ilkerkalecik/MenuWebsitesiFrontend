/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        primaryWhite:'#ffffff',
        secondaryWhite:'#f3f3f3',
        primaryBlack:'#0d0d0d',
        secondaryBlack:'#262626',
        primaryMain:'#004d99',
        secondaryMain:'#0080ff',
        mainColor:'#1f520f',
        

      },
      fontFamily:{
        "lato": ['Open Sans', 'serif']
        
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

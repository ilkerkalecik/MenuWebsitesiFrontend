/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        primaryWhite:'#ffffff',
        secondaryWhite:'#f2f2f2',
        primaryBlack:'#0d0d0d',
        secondaryBlack:'#262626',
        primaryMain:'#004d99',
        secondaryMain:'#0080ff',
        

      },
      fontFamily:{
        "lato": ['Open Sans', 'serif']
        
      },
    },
  },
  plugins: [],
};
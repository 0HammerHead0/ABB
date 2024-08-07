/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      backgroundImage: {
        'blue-gradient-button': 'linear-gradient(79.69deg, #1D4ED8 -0.64%, #5AD7FE 107.84%)',
        'red-blue-gradient-button':'linear-gradient(79.69deg, #DB2721 -0.64%, #5AD7FE 107.84%)'

      },
    },
  },
  plugins: [],
}


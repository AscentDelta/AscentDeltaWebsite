export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          teal: '#14b8ab',
          tealdark: '#0f9d92',
          blue: '#1b5e97',
          navy: '#164a7e',
        },
      },
    },
  },
  plugins: [],
}

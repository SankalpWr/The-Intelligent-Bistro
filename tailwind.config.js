/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bistro: {
          bg: '#1a1a1a',
          surface: '#252523',
          card: '#2a2a28',
          border: '#3a3a36',
          cream: '#f5f0e8',
          gold: '#c9a84c',
          'gold-dim': '#8e7634',
          sage: '#8a9a7b',
          rust: '#b85c3a',
          muted: '#8b8780',
        },
      },
      fontFamily: {
        display: ['Cormorant_Garamond_500Medium'],
        'display-bold': ['Cormorant_Garamond_700Bold'],
        body: ['DMSans_400Regular'],
        'body-medium': ['DMSans_500Medium'],
        'body-bold': ['DMSans_700Bold'],
      },
    },
  },
  plugins: [],
};

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Purple Rebelde
        purple: {
          50: '#faf5ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#8B5CF6', // Principal
          700: '#7c3aed',
          900: '#581c87',
          950: '#3b0764',
        },
        pink: {
          400: '#f472b6',
          500: '#EC4899', // Acento
          600: '#db2777',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      dropShadow: {
        'glow': '0 0 30px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [],
}

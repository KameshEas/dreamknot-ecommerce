/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-gold': '#F6E6B6',
        'mid-gold': '#D4C08A',
        'deep-gold': '#C1A86F',
        'navy': '#19325C',
        'off-white': '#FCFAF5',
        'dark-gray': '#333333',
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'playfair': ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(25, 50, 92, 0.05), 0 1px 3px 0 rgba(25, 50, 92, 0.1)',
        'md': '0 4px 6px -1px rgba(25, 50, 92, 0.05), 0 2px 4px -1px rgba(25, 50, 92, 0.1)',
        'lg': '0 10px 15px -3px rgba(25, 50, 92, 0.05), 0 4px 6px -2px rgba(25, 50, 92, 0.1)',
        'xl': '0 20px 25px -5px rgba(25, 50, 92, 0.05), 0 10px 10px -5px rgba(25, 50, 92, 0.1)',
        '2xl': '0 25px 50px -12px rgba(25, 50, 92, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(25, 50, 92, 0.05)',
        'glow': '0 0 20px rgba(193, 166, 111, 0.3)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #F6E6B6 0%, #D4C08A 50%, #C1A86F 100%)',
        'gradient-navy': 'linear-gradient(135deg, #19325C 0%, #2A4A7A 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(246, 230, 182, 0.1) 0%, rgba(212, 192, 138, 0.05) 100%)',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}

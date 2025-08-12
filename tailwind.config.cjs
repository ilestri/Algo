/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        panel: 'var(--panel)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        text: 'var(--text)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        vault: {
          bg: '#f6ecf3',
          bg2: '#e9e0fb',
          ink: '#241b1f',
        },
      },
      boxShadow: {
        shelf: '0 18px 30px -14px rgba(80, 40, 90, 0.35)',
      },
    },
  },
  plugins: [],
}

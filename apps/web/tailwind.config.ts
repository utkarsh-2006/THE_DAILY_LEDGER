import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F3EFE6',
        'paper-light': '#FAF5E8',
        'paper-dark': '#E5DFD1',
        ink: '#151515',
        'ink-muted': '#58554E',
        brass: '#A7833A',
        'brass-light': '#D4AF37',
        carmine: '#9F3030',
        fgreen: '#315C46',
        cobalt: '#234E70',
      },
      fontFamily: {
        masthead: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        stamp: ['Oswald', 'sans-serif'],
      },
      boxShadow: {
        pawn: '0 8px 16px -2px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.4)',
        dice: '2px 4px 0px #151515, -1px -1px 0px rgba(255,255,255,0.8) inset',
        boardtile: 'inset 0 0 0 1px #151515',
      },
      animation: {
        'dice-hover': 'diceShake 0.4s ease-in-out infinite alternate',
      },
      keyframes: {
        diceShake: {
          '0%': { transform: 'rotate(-4deg) scale(1.02)' },
          '100%': { transform: 'rotate(4deg) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

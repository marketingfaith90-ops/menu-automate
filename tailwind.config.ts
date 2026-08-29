import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8A042',
          light: '#DDB85A',
          dark: '#A07828',
        },
        forest: {
          DEFAULT: '#243318',
          mid: '#3A5227',
        },
        claret: '#8C1C13',
        cream: '#F4EFE3',
        espresso: '#2A1A0E',
        stone: '#7A6B56',
        panel: '#1A1A1A',
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        dancing: ['var(--font-dancing)', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config

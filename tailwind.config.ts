import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream:      '#FAF5EF',
        terracotta: '#C28B6A',
        mauve:      '#9B859C',
        lavender:   '#C4B0C8',
        honey:      '#D4A96A',
        slate:      '#3A3A3A',
        dust:       '#E8DDD6',
        rose:       '#D4A0A0',
        card:       'rgba(255,255,255,0.7)',
        border:     'rgba(196,176,200,0.3)',
        // dark variants
        'dark-bg':   '#1A1520',
        'dark-card': 'rgba(40,30,45,0.8)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(155,133,156,0.12)',
        'card-hover': '0 8px 32px rgba(155,133,156,0.18)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
export default config

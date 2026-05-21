import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      },
      colors: {
        cream: '#F0EDE5',
        'cream-alt': '#ECE6D9',
        periwinkle: '#6E89C8',
        charcoal: '#1F1B17',
        taupe: '#C4B8A6',
        nearblack: '#1A1714',
        terracotta: '#9F6B5C',
        gold: '#907533'
      },
      screens: {
        xs: '380px',
        '3xl': '1680px',
        '4xl': '1920px'
      }
    }
  },
  plugins: []
};

export default config;

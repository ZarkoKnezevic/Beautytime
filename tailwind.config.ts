import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * Design tokens come from the approved prototype in `design/`
 * (see design/README.md). They are defined as CSS variables in
 * src/app/globals.css and referenced here so Tailwind utilities and the
 * prototype's ported classes share a single source of truth.
 */
export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'clamp(20px, 4.7vw, 68px)',
      screens: {},
    },
    extend: {
      colors: {
        sand: 'var(--bg)', // page background  #F7F0E6
        surface: 'var(--surface)', // #E7D7C5
        ink: 'var(--text)', // body text        #49382E
        muted: 'var(--muted)', // #716053
        ivory: 'var(--ivory)', // #FFF9F0
        line: 'var(--line)', // hairlines        #CDB99E
        gold: {
          DEFAULT: 'var(--gold)', // #B99552
          light: 'var(--gold-light)', // #DCC394
          dark: 'var(--gold-dark)', // #7F5F30
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1440px',
      },
      keyframes: {
        tw: {
          '0%,100%': { opacity: '.2', transform: 'scale(.6)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        tw: 'tw 3.2s ease-in-out infinite',
        spin: 'spin 26s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

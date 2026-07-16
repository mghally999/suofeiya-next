import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import '@/styles/globals.css';

import SmoothScroll from '@/components/providers/SmoothScroll';
import ScrollReveal from '@/components/providers/ScrollReveal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cursor from '@/components/layout/Cursor';
import Preloader from '@/components/layout/Preloader';
import CookieBanner from '@/components/layout/CookieBanner';
// ThemeProvider + ThemeToggle removed per STRICT_100_PERCENT_ADDENDUM —
// the site is cream-only. The "cream" theme values are now defaults
// on :root in globals.css.

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-cormorant',
  preload: true
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-sans-manrope',
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://suofeiya.example'),
  title: {
    default: 'Suofeiya — Crafting Timeless, Tailored Spaces',
    template: '%s · Suofeiya'
  },
  description:
    'Suofeiya designs whole-house residences, commercial workplaces and bespoke developments. One studio, end-to-end architecture, interiors, joinery and project delivery.',
  openGraph: {
    title: 'Suofeiya — Crafting Timeless, Tailored Spaces',
    description: 'Whole-house design, custom cabinetry, fit-out and refined materials.',
    type: 'website',
    locale: 'en_US'
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0EDE5' },
    { media: '(prefers-color-scheme: dark)', color: '#14110E' }
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/*
          Pre-paint gate for the preloader. The server can't read
          sessionStorage, so it always ships the preloader markup
          *without* `is-hidden` — meaning on every reload the overlay
          painted over the hero for the split second before React
          hydrated and hid it. This blocking inline script runs before
          first paint and, if the preloader has already been shown this
          session, tags <html> so CSS removes the overlay immediately —
          no flash, no re-cover. First visit is untouched.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('__sf_preloader_shown')==='1')document.documentElement.classList.add('sf-preloader-done')}catch(e){}"
          }}
        />
      </head>
      <body>
        <Preloader />
        <Cursor />
        <SmoothScroll />
        <ScrollReveal />
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

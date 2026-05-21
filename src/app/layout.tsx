import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import '@/styles/globals.css';

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Cursor from '@/components/layout/Cursor';
import Preloader from '@/components/layout/Preloader';
import CookieBanner from '@/components/layout/CookieBanner';
import ThemeToggle from '@/components/layout/ThemeToggle';

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
    <html lang="en" dir="ltr" data-theme="cream" className={`${display.variable} ${sans.variable}`}>
      <body>
        <ThemeProvider>
          <Preloader />
          <Cursor />
          <SmoothScroll />
          <Header />
          <ThemeToggle />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

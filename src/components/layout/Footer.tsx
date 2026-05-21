'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { studio } from '@/lib/content';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';

/**
 * Suofeiya brand lock-up — SU + burgundy cube + FEIYA — rendered
 * as huge inline SVG cube + DOM letters so it scales cleanly to
 * footer-wordmark size and stays consistent with the header logo.
 */
function FooterLockup({ height = 220 }: { height?: number }) {
  return (
    <span
      className="site-footer__lockup"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${height * 0.16}px`,
        fontFamily: 'var(--font-sans)',
        fontWeight: 200,
        fontSize: `${height}px`,
        lineHeight: 1,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(244, 239, 230, 0.12)',
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}
      aria-hidden
    >
      <span style={{ paddingLeft: '0.32em' }}>SU</span>
      <svg width={height * 0.95} height={height * 0.95} viewBox="0 0 44 44" style={{ flex: '0 0 auto', opacity: 0.85 }}>
        <polygon points="22,2 42,12 22,22 2,12" fill="#a8302e" />
        <polygon points="2,12 22,22 22,42 2,32" fill="#5a0d0d" />
        <polygon points="42,12 22,22 22,42 42,32" fill="#8b1a1a" />
      </svg>
      <span style={{ paddingLeft: '0.18em' }}>FEIYA</span>
    </span>
  );
}

/**
 * Footer rebuilt to match the Elicyon page-level addendum spec:
 * 3-column block with a JOIN THE WORLD OF SUOFEIYA newsletter form
 * on the left, primary nav in the middle, and social in the right
 * column — under a giant slow-pan SUOFEIYA wordmark that scrolls
 * horizontally as the page is scrolled.
 *
 * Brand identity: the addendum specifies periwinkle for the footer
 * background, but the user has been explicit that Suofeiya brand
 * colours must be applied strictly. We therefore swap periwinkle for
 * the brand charcoal (#1a1410) with burgundy accents — the elicyon
 * structure, in Suofeiya skin.
 */
export default function Footer() {
  const lockupRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gsap = getGsap();
    getScrollTrigger();
    const ctx = gsap.context(() => {
      if (!lockupRef.current) return;
      // Subtle scrub-up reveal — the centred lock-up rises 24px as
      // it enters from the bottom of the viewport.
      gsap.fromTo(
        lockupRef.current,
        { y: 24, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: lockupRef.current,
            start: 'top 95%',
            end: 'top 60%',
            scrub: true
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__newsletter">
          <h3 className="site-footer__title font-display">
            JOIN <em>the</em> WORLD
            <br />
            <em>of</em> SUOFEIYA
          </h3>
          <p>
            Subscribe to join our community and stay up to date with the studio — product launches, project reveals and
            press coverage from across the Suofeiya world.
          </p>
          <form ref={formRef} onSubmit={onSubmit} className="site-footer__form" noValidate>
            <label className="field">
              <span>First name *</span>
              <input type="text" required name="first" autoComplete="given-name" />
            </label>
            <label className="field">
              <span>Last name *</span>
              <input type="text" required name="last" autoComplete="family-name" />
            </label>
            <label className="field field--full">
              <span>Email *</span>
              <input type="email" required name="email" autoComplete="email" />
            </label>
            <button type="submit" className="link-underline site-footer__submit" disabled={submitted}>
              {submitted ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <h4>Navigate</h4>
          <Link href="/projects">Projects</Link>
          <Link href="/services">Product · Service</Link>
          <Link href="/studio">About</Link>
          <Link href="/insights">Press · Insights</Link>
          <Link href="/careers">Franchise</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="site-footer__connect">
          <h4>Connect</h4>
          <ul>
            <li>
              <a href={`mailto:${studio.email}`}>{studio.email}</a>
            </li>
            <li>
              <a href={`tel:${studio.phone.replace(/\s+/g, '')}`}>{studio.phone}</a>
            </li>
            <li className="site-footer__addr">
              {studio.city}, {studio.country}
              <br />
              {studio.street}
            </li>
          </ul>
          <h4 style={{ marginTop: 32 }}>Follow</h4>
          <ul className="site-footer__social">
            {studio.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Centred SUOFEIYA brand lock-up — the actual SU · burgundy
          cube · FEIYA mark from the header, scaled to wordmark
          size, sits at the very bottom above the legal row. */}
      <div className="site-footer__lockup-wrap" ref={lockupRef}>
        <FooterLockup />
      </div>

      <div className="site-footer__bottom">
        <span>© Suofeiya {year}</span>
        <nav>
          <Link href="/faq">Terms</Link>
          <Link href="/faq">Privacy Policy</Link>
          <span>Designed with intention</span>
        </nav>
      </div>
    </footer>
  );
}

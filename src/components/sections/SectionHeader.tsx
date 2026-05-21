'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Props {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: 'center' | 'left';
  tone?: 'cream' | 'dark';
  cta?: { label: string; href: string };
}

/**
 * Universal section header — index (01, 02 …), eyebrow,
 * Cormorant title with optional italic burgundy emphasis, and an
 * optional sub-paragraph + CTA. Centred or left-aligned. Used at the
 * top of every page section so the visual hierarchy stays consistent
 * across the site.
 */
export default function SectionHeader({ index, eyebrow, title, sub, align = 'center', tone = 'cream', cta }: Props) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.3) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.2, 0.3, 0.5] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header ref={root} className={`section-header section-header--${align} section-header--${tone}`}>
      <div className="section-header__meta fade-up">
        <span className="section-header__index">— {index}</span>
        <span className="section-header__eyebrow">{eyebrow}</span>
      </div>
      <h2 className="section-header__title font-display fade-up">{title}</h2>
      {sub ? <p className="section-header__sub fade-up">{sub}</p> : null}
      {cta ? (
        <div className="section-header__cta fade-up">
          <Link href={cta.href} className="link-underline">
            {cta.label}
          </Link>
        </div>
      ) : null}
    </header>
  );
}

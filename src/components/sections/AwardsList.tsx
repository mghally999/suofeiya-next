'use client';

import { useEffect, useRef } from 'react';

interface Entry {
  title: string;
  year: string;
}

interface Props {
  recognition: Entry[];
  awards: Entry[];
}

/**
 * AWARDS / RECOGNITION list block — page-level addendum §7.
 *
 * Each row's 1px bottom divider draws on from left to right as the
 * row enters the viewport, with a 60ms stagger between rows. Pure
 * IntersectionObserver — no GSAP, no DOM mutation, so it survives
 * HMR cleanly.
 */
export default function AwardsList({ recognition, awards }: Props) {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const rows = Array.from(root.current.querySelectorAll<HTMLElement>('.award'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const i = rows.indexOf(el);
          el.style.transitionDelay = `${i * 60}ms`;
          el.classList.add('is-drawn');
          io.unobserve(el);
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className="awards2" ref={root} aria-label="Recognition and awards">
      <div className="awards2__inner">
        <div className="awards2__group">
          <p className="awards2__label">Recognition</p>
          <ul className="awards2__list">
            {recognition.map((a) => (
              <li className="award" key={a.title}>
                <span className="award__title">{a.title}</span>
                <span className="award__year">{a.year}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="awards2__group">
          <p className="awards2__label">Awards</p>
          <ul className="awards2__list">
            {awards.map((a) => (
              <li className="award" key={a.title}>
                <span className="award__title">{a.title}</span>
                <span className="award__year">{a.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

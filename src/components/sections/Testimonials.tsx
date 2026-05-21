'use client';

import { useEffect, useRef, useState } from 'react';
import { testimonials } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Customer Feedbacks — B2B partner quotes mapped to the four real
 * Suofeiya case studies (GH, SLS, NC, ST). Click a card to pin the
 * quote in the main panel.
 */
export default function Testimonials() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.2, 0.25, 0.5] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const current = testimonials[active];

  return (
    <section className="quote" ref={root} aria-label="Suofeiya customer feedbacks">
      <div className="quote__inner">
        <SectionHeader
          index="09"
          eyebrow="Customer Feedbacks"
          title={
            <>
              <em>One</em> contract, one team, no rework.
            </>
          }
          sub="What developers and hospitality groups say after running a Suofeiya whole-house specification end to end."
          align="left"
          tone="cream"
        />
        <div className="quote__layout">
          <blockquote className="quote__main fade-up" key={active}>
            <span className="quote__mark font-display" aria-hidden>
              ＂
            </span>
            <p className="font-display">{current.quote}</p>
            <footer>
              <span className="quote__author">{current.author}</span>
              <span className="quote__role">{current.role}</span>
            </footer>
          </blockquote>
          <ul className="quote__list">
            {testimonials.map((t, i) => (
              <li key={t.author} className={`quote__item fade-up${i === active ? ' is-active' : ''}`}>
                <button type="button" onClick={() => setActive(i)} data-cursor="read">
                  <span className="quote__num font-display">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{t.author}</strong>
                    <em>{t.role}</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

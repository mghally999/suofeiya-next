'use client';

import { useEffect, useRef } from 'react';
import { stats } from '@/lib/content';

/**
 * Numeric strip lifted straight from the suofeiya mirror banner:
 * 1M+ m² of plants, 4,000+ showrooms, 15,000+ projects, 14,906
 * employees, 400+ patents, NAF eco-friendly, etc. Each card fades
 * up only once the strip is in view.
 */
export default function Stats() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.2) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.15, 0.2, 0.4] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.06}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="stats" ref={root} aria-label="Suofeiya by the numbers">
      <div className="stats__inner">
        <div className="stats__head">
          <h2 className="font-display fade-up">
            A studio at <em>global</em> scale —
            <br />
            measured in millions of square metres.
          </h2>
          <p className="fade-up">
            Suofeiya operates 8 manufacturing bases, more than 1,000,000&nbsp;m² of plants, 4,000+ showrooms and a
            14,906-strong global team — closing the loop from drawing to handover.
          </p>
        </div>
        <div className="stats__grid">
          {stats.map((s) => (
            <div key={s.label} className="stat fade-up">
              <div className="stat__label">{s.label}</div>
              <div className="stat__num font-display">
                {s.num}
                {s.suffix ? <span className="plus">{s.suffix}</span> : null}
              </div>
              <p className="stat__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

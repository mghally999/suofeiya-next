'use client';

import { useEffect, useRef } from 'react';
import { milestones } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * History & Development timeline — 1981 to today.
 * Year + title + body, on a vertical rule with burgundy dots.
 */
export default function Timeline() {
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
    <section className="timeline" ref={root} id="history" aria-label="Suofeiya history and development">
      <div className="timeline__inner">
        <SectionHeader
          index="02"
          eyebrow="History & Development"
          title={
            <>
              Since <em>1981</em> — four decades of customised craft
            </>
          }
          sub="From a French built-in-wardrobe pioneer to an 8-plant, 14,906-strong whole-house studio listed on the Shenzhen Stock Exchange. The Suofeiya timeline, in seven moves."
          align="left"
          tone="cream"
        />
        <ol className="timeline__list">
          {milestones.map((m) => (
            <li key={m.year} className="timeline__item fade-up">
              <span className="timeline__dot" aria-hidden />
              <div className="timeline__year font-display">{m.year}</div>
              <div className="timeline__body">
                <h3 className="font-display">{m.title}</h3>
                <p>{m.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

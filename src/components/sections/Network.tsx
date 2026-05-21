'use client';

import { useEffect, useRef } from 'react';
import { manufacturingBases } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Manufacturing & Sales Network — 8 Suofeiya bases with focus and
 * plant area. Laid out as a tabular grid so the data reads like an
 * operations spec sheet, not a brochure.
 */
export default function Network() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.15) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.1, 0.15, 0.3] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.05}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="network" ref={root} id="manufacturing" aria-label="Suofeiya manufacturing network">
      <div className="network__inner">
        <SectionHeader
          index="05"
          eyebrow="Manufacturing Network"
          title={
            <>
              Eight bases. One <em>specification</em>.
            </>
          }
          sub="Suofeiya operates 8 manufacturing bases worldwide. Every base ships against the same DIYHome 3D specification and the same NAF / SGS board standard — your kitchen, wardrobe and door arrive from the nearest plant on a single bill of materials."
          align="left"
          tone="cream"
        />
        <div className="network__table">
          <div className="network__row network__row--head">
            <span>Base</span>
            <span>Region</span>
            <span>Focus</span>
            <span>Plant area</span>
          </div>
          {manufacturingBases.map((b) => (
            <div key={b.city} className="network__row fade-up">
              <span className="network__city font-display">{b.city}</span>
              <span className="network__region">{b.region}</span>
              <span className="network__focus">{b.focus}</span>
              <span className="network__area font-display">{b.area}</span>
            </div>
          ))}
        </div>
        <div className="network__totals fade-up">
          <div>
            <span className="network__totals-num font-display">1.1M+</span>
            <span className="network__totals-lab">Total plant m²</span>
          </div>
          <div>
            <span className="network__totals-num font-display">4,000+</span>
            <span className="network__totals-lab">Retail showrooms</span>
          </div>
          <div>
            <span className="network__totals-num font-display">14,906</span>
            <span className="network__totals-lab">Global team</span>
          </div>
        </div>
      </div>
    </section>
  );
}

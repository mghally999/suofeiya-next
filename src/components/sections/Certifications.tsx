'use client';

import { useEffect, useRef } from 'react';
import { certifications } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Certification & Honor grid — NAF, SGS, CARB P2, ISO 9001, ISO
 * 14001, FSC, Red Dot, iF. Each entry is a card with the
 * certification code in burgundy and a one-line detail.
 */
export default function Certifications() {
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
      (el as HTMLElement).style.transitionDelay = `${i * 0.04}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="certs" ref={root} id="certification" aria-label="Suofeiya certifications and honors">
      <div className="certs__inner">
        <SectionHeader
          index="08"
          eyebrow="Certification & Honor"
          title={
            <>
              Audited <em>at every line</em> — NAF, SGS, ISO, Red Dot, iF.
            </>
          }
          sub="Suofeiya boards ship at no-added-formaldehyde grade and are independently audited for emissions, quality management and responsible sourcing — across every base, every panel."
          align="center"
          tone="cream"
        />
        <div className="certs__grid">
          {certifications.map((c) => (
            <article key={c.code} className="cert fade-up">
              <div className="cert__code font-display">{c.code}</div>
              <h3 className="cert__title">{c.title}</h3>
              <p className="cert__detail">{c.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

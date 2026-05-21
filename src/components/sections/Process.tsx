'use client';

import { useEffect, useRef } from 'react';
import { processSteps } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Four-step delivery loop — DIYHome → Pack & Deliver → Tooling &
 * Installation → Quality Control. Pulled directly from the
 * mirrored SERVICE menu on global.suofeiya.com.
 */
export default function Process() {
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
      (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="proc" ref={root} id="process" aria-label="Suofeiya delivery process">
      <div className="proc__inner">
        <SectionHeader
          index="06"
          eyebrow="The Suofeiya delivery loop"
          title={
            <>
              Drawing → factory → site, with <em>one</em> handshake.
            </>
          }
          sub="DIYHome 3D design, engineered crating, site-trained installation and a four-stage inspection — closed inside a single Suofeiya contract."
          align="left"
          tone="dark"
        />
        <ol className="proc__steps">
          {processSteps.map((s, i) => (
            <li key={s.title} className="proc__step fade-up">
              <span className="proc__num font-display">{String(i + 1).padStart(2, '0')}</span>
              <div className="proc__body">
                <h3 className="font-display">{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

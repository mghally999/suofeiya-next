'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { subsidiaries } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Suofeiya sub-brand family — Suofeiya · Wardrobe, Milan,
 * SOGAL · Door, Hua'he. Mirrored from the ABOUT > Subsidiary page.
 */
export default function Subsidiaries() {
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
    <section className="subs" ref={root} id="subsidiary" aria-label="Suofeiya sub-brand family">
      <div className="subs__inner">
        <SectionHeader
          index="10"
          eyebrow="Subsidiary brands"
          title={
            <>
              The Suofeiya <em>family</em> — four brands, one supply chain.
            </>
          }
          sub="Suofeiya operates a curated family of customisation brands — every one shares the same NAF / SGS material standard and the same DIYHome 3D specification flow."
          align="left"
          tone="cream"
        />
        <div className="subs__grid">
          {subsidiaries.map((b, i) => (
            <article key={b.name} className="sub-card fade-up">
              <figure className="sub-card__media scroll-zoom">
                <Image
                  src={b.image}
                  alt={`${b.name} — ${b.positioning}`}
                  fill
                  sizes="(max-width: 900px) 50vw, 22vw"
                  quality={70}
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
              <span className="sub-card__idx font-display">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="sub-card__name font-display">{b.name}</h3>
              <span className="sub-card__pos">{b.positioning}</span>
              <p>{b.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

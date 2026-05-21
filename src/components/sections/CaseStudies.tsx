'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { caseStudies } from '@/lib/content';
import SectionHeader from './SectionHeader';

/**
 * Full Suofeiya case-study grid — GH / SLS / NC / ST and the
 * pavilions. Each card carries scope, location, delivery status,
 * a long body paragraph and a 3-row metrics block lifted from the
 * mirrored /detail/ pages.
 */
export default function CaseStudies() {
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
      (el as HTMLElement).style.transitionDelay = `${i * 0.06}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="cases" ref={root} id="case-studies" aria-label="Suofeiya case studies">
      <div className="cases__inner">
        <SectionHeader
          index="04"
          eyebrow="Case studies · B2B program"
          title={
            <>
              The four <em>flagship</em> Suofeiya partnerships
            </>
          }
          sub="GH and NC Apartment, SLS and ST Hotel — every project ran on a single Suofeiya specification covering kitchen, wardrobe, vanity, door and installation."
          align="left"
          tone="cream"
        />
        <div className="cases__grid">
          {caseStudies.map((c, i) => (
            <article key={c.slug} className={`case fade-up case--${i % 2 === 0 ? 'l' : 'r'}`}>
              <Link href={`/projects/${c.slug}`} className="case__media" data-cursor="view case">
                <Image src={c.image} alt={c.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                <span className="case__cat">{c.category}</span>
              </Link>
              <div className="case__body">
                <span className="case__eyebrow">{c.eyebrow}</span>
                <h3 className="case__title font-display">{c.title}</h3>
                <dl className="case__meta">
                  <div>
                    <dt>Scope</dt>
                    <dd>{c.scope}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{c.location}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{c.delivered}</dd>
                  </div>
                </dl>
                <p className="case__copy">{c.body}</p>
                <ul className="case__metrics">
                  {c.metrics.map((m) => (
                    <li key={m.label}>
                      <span className="case__metric-val font-display">{m.value}</span>
                      <span className="case__metric-lab">{m.label}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/projects/${c.slug}`} className="link-underline" data-cursor="read case">
                  Read case study
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

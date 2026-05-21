'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { services } from '@/lib/content';

/**
 * Split-pane services list: sticky image on the left, scrolling
 * service blocks on the right.
 *
 * Two IntersectionObservers run here:
 *   1. Tracks which block is most visible, so the sticky left image
 *      swaps to the matching project frame.
 *   2. Adds `is-in` to each title as the block enters the viewport,
 *      driving the title's opacity scrub from 0.3 → 1 (page-level
 *      addendum §8).
 */
export default function ServicesClient() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const visibility = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = refs.current.findIndex((el) => el === visible[0].target);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: [0.1, 0.3, 0.5, 0.7, 0.9] }
    );
    const titleReveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add('is-in');
          titleReveal.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    refs.current.forEach((el) => {
      if (!el) return;
      visibility.observe(el);
      const t = el.querySelector('.sp-title');
      if (t) titleReveal.observe(t);
    });
    return () => {
      visibility.disconnect();
      titleReveal.disconnect();
    };
  }, []);

  return (
    <section className="split-pane">
      <div className="split-pane__left">
        {services.map((s, i) => (
          <div key={s.title} className={`sp-image${i === active ? ' is-active' : ''}`}>
            <Image src={s.image} alt={s.title} fill sizes="50vw" style={{ objectFit: 'cover' }} />
            <figcaption>
              Project · <span style={{ color: 'var(--brand-burgundy-soft)' }}>{s.project}</span> →
            </figcaption>
          </div>
        ))}
      </div>
      <div className="split-pane__right">
        {services.map((s, i) => (
          <article
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="service-block"
          >
            <div className="service-num">{s.number}</div>
            <h2 className="sp-title">{s.title}</h2>
            <p>{s.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

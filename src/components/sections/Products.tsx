'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { products } from '@/lib/content';

/**
 * Horizontal-scroll product rail.
 *
 * Pinning strategy
 * ----------------
 * We do NOT use ScrollTrigger's `pin: true` here. That option wraps
 * the pinned element in a `pin-spacer` div which React doesn't know
 * about — during HMR or route change React tries to remove DOM
 * nodes that are no longer where it expects, throwing
 * "Failed to execute 'removeChild' on 'Node'".
 *
 * Instead the section's own CSS uses `position: sticky` on
 * `.ph__sticky`, giving us the same pinning effect using plain
 * layout. ScrollTrigger only drives the x-translate scrub of the
 * inner track — no DOM mutation, no pin-spacer.
 *
 * Cards stay at full opacity throughout (no fade scrub) so every
 * product image is visible while the user scrolls the rail.
 */
export default function Products() {
  const root = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current || !track.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    if (reduce || narrow) return;

    const gsap = getGsap();
    getScrollTrigger();
    const ctx = gsap.context(() => {
      const trackEl = track.current!;
      const sectionEl = root.current!;
      const recalc = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      gsap.to(trackEl, {
        x: () => -recalc(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${recalc()}`,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="ph" ref={root} aria-label="Suofeiya product categories">
      <div className="ph__sticky">
        <div className="ph__head">
          <span className="ph__eyebrow">— 11 · Suofeiya · Product</span>
          <h2 className="font-display">
            <em>Product</em> categories
          </h2>
          <p>
            Kitchen Cabinet · Closet &amp; Wardrobe · Vanity Cabinet · Built-in Furniture · Interior Door · Loose
            Furniture · Hardware &amp; Accessories — drawn under one specification, manufactured on Industry 4.0 lines.
          </p>
          <span className="ph__hint">
            Scroll <span aria-hidden>→</span>
          </span>
        </div>
        <div className="ph__viewport">
          <div className="ph__track" ref={track} role="list">
            {products.map((p, i) => (
              <Link key={p.title} href={p.href} className="ph-card" role="listitem" data-cursor="explore">
                <div className="ph-card__index">{String(i + 1).padStart(2, '0')}</div>
                <div className="ph-card__img">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 900px) 78vw, 380px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="ph-card__body">
                  <div className="ph-card__tag">{p.tag}</div>
                  <h3 className="ph-card__title">{p.title}</h3>
                  <p className="ph-card__sub">{p.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

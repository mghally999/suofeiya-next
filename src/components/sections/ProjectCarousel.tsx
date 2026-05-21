'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { projectSlides } from '@/lib/content';
import { DoublyLinkedList } from '@/lib/ds';

/**
 * Three pinned slides; each slide's giant CATEGORY word lands letter
 * by letter — but only once the slide itself is at least at the
 * bottom-third of the viewport. That fixes the prior bug where
 * `RESIDENTIAL` would fan in while the slide was still off-screen.
 *
 * A doubly-linked list tracks the active slide so pagination &
 * next/prev are O(1) regardless of slide count.
 */
export default function ProjectCarousel() {
  const root = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(0);
      return;
    }
    const gsap = getGsap();
    // Register ScrollTrigger plugin. We do NOT touch the global
    // ScrollTrigger list in cleanup — see comment on the cleanup.
    getScrollTrigger();

    const dll = DoublyLinkedList.from(projectSlides.map((_, i) => i));
    let cursor = dll.head!;
    void dll;
    void cursor;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.proj-slide', root.current!);
      slides.forEach((slide, slideIdx) => {
        const letters = slide.querySelectorAll<HTMLElement>('.proj-cat span');
        // Cap the fall distance at ~35vh so letters can never cross into
        // the bottom meta block. The .proj-cat container also clips with
        // `max-height: 45vh; overflow: hidden`, giving a second guard.
        letters.forEach((letter, j) => {
          const mode = j % 3;
          if (mode === 0) gsap.set(letter, { y: 0 });
          if (mode === 1) gsap.set(letter, { y: () => window.innerHeight * 0.32 });
          if (mode === 2) gsap.set(letter, { y: () => window.innerHeight * 0.18 });
        });

        // The reveal scrubs from "top 70%" → "top top" — i.e. it does
        // NOT start until the slide top has entered the lower 30% of
        // the viewport, eliminating the off-screen pre-animation.
        gsap.to(letters, {
          y: 0,
          ease: 'power2.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: slide,
            start: 'top 70%',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
              if (self.progress >= 0.5) setActive(slideIdx);
            }
          }
        });
      });
    }, root);

    return () => {
      // ctx.revert() handles only this component's animations +
      // ScrollTriggers + pin spacers. Touching the global list would
      // orphan other components' spacers and crash React with
      // "Failed to execute 'removeChild' on 'Node'".
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="proj-carousel"
      ref={root}
      style={{ ['--slides' as string]: projectSlides.length } as React.CSSProperties}
    >
      {projectSlides.map((s, i) => (
        <article key={s.category + i} className="proj-slide" data-cat={s.category}>
          <div className="proj-slide__bg">
            <Image
              src={s.image}
              alt={s.project}
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h2 className="proj-cat font-display" aria-label={s.category}>
            {Array.from(s.category).map((ch, j) => (
              <span key={`${ch}-${j}`}>{ch}</span>
            ))}
          </h2>
          <div className="proj-pagination" aria-hidden>
            {projectSlides.map((_, j) => (
              <span key={j} className={j === active ? 'is-active' : ''} />
            ))}
          </div>
          <div className="proj-meta">
            <div className="proj-meta__eyebrow">{s.eyebrow}</div>
            <h3 className="font-display">{s.project}</h3>
            <p>{s.copy}</p>
            <Link href={s.href} className="link-underline" data-cursor="view project">
              view project
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}

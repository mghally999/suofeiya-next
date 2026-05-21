'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { IMG, heroWords, heroTagline } from '@/lib/content';

/**
 * Hero is gated on viewport intersection — words stagger in only after
 * the section is at least 40% on-screen, and only on the first entry.
 * The background photograph is darkened by a multi-stop scrim so the
 * white serif wordmark and the header remain readable over any frame.
 */
export default function Hero() {
  const root = useRef<HTMLElement | null>(null);
  const bg = useRef<HTMLDivElement | null>(null);
  const tagline = useRef<HTMLDivElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const words = root.current.querySelectorAll<HTMLElement>('.hero__word');
    const tag = tagline.current;

    const reveal = () => {
      if (hasRun.current) return;
      hasRun.current = true;
      words.forEach((w, i) => setTimeout(() => w.classList.add('is-in'), i * 240));
      if (tag) tag.classList.add('is-in');
    };

    if (reduce) {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.4) {
            reveal();
            io.disconnect();
          }
        });
      },
      { threshold: [0, 0.2, 0.4, 0.6] }
    );
    io.observe(root.current);

    const gsap = getGsap();
    // Force ScrollTrigger to register before we open the context.
    getScrollTrigger();
    const ctx = gsap.context(() => {
      if (bg.current) {
        gsap.to(bg.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }, root);

    return () => {
      io.disconnect();
      // ctx.revert() removes only the animations + scrollTriggers + DOM
      // spacers created inside *this* context. Do NOT kill all global
      // ScrollTriggers here — that would orphan pin-spacers belonging
      // to other components and crash React on unmount.
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" ref={root} aria-label="Suofeiya — Crafting Timeless Tailored Spaces">
      <div className="hero__bg" ref={bg}>
        <Image
          src={IMG.kitchen}
          alt="Suofeiya kitchen — full-house customisation"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="hero__words">
        {heroWords.map((w, i) => (
          <span key={w} className={`hero__word hero__word--${i + 1}`}>
            {w}
          </span>
        ))}
      </div>
      <div className="hero__tagline" ref={tagline}>
        <p>{heroTagline.copy}</p>
        <div className="since">
          Suofeiya <em>·</em> {heroTagline.since}
        </div>
      </div>
    </section>
  );
}

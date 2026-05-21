'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { IMG } from '@/lib/content';

/**
 * Pinned, scrubbed manifesto — Suofeiya version.
 *
 * The previous implementation used per-line x/y magic numbers tuned
 * for the original Elicyon copy. Once we replaced the copy with the
 * Suofeiya brand narrative those numbers no longer matched, and lines
 * stacked / overlapped. This version drops the per-line choreography
 * entirely:
 *
 *   - The statement is a single centred paragraph that scrubs in word
 *     by word as the section is pinned, then scrubs out the same way.
 *   - Five floating Suofeiya frames slide up behind the text on their
 *     own scrub timeline.
 *
 * Layout is plain block flow + transform — no horizontal offsets, no
 * collapse arrays. The copy can change freely without the layout
 * breaking.
 */
export default function Statement() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const gsap = getGsap();
    // Register ScrollTrigger plugin; we do NOT touch the global
    // ScrollTrigger list in cleanup — see comment at the bottom of
    // this effect.
    getScrollTrigger();
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.s2-word', root.current!);
      const imgs = gsap.utils.toArray<HTMLElement>('.s2-img', root.current!);

      gsap.set(words, { opacity: 0.12 });
      imgs.forEach((img, i) => gsap.set(img, { yPercent: 60 + i * 12, opacity: 0 }));

      // The pinning is done in CSS (.s2-pin is `position: sticky`).
      // We deliberately do NOT use ScrollTrigger's `pin: true` here —
      // that wraps the target in a pin-spacer div which React doesn't
      // know about, and produces the
      // "Failed to execute 'removeChild' on 'Node'" crash on HMR /
      // route change. ScrollTrigger only drives the scrub here.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });

      tl.to(words, { opacity: 1, duration: 0.5, stagger: 0.01, ease: 'none' }, 0);
      imgs.forEach((img, i) => {
        tl.to(img, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.05 + i * 0.05);
        tl.to(img, { yPercent: -50 - i * 10, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.75 + i * 0.02);
      });
      tl.to(words, { opacity: 0.25, duration: 0.3, stagger: 0.005, ease: 'none' }, 0.78);
    }, root);

    return () => {
      // ctx.revert() removes only animations + ScrollTriggers + pin
      // spacers created inside *this* context. Killing the global
      // ScrollTrigger list here would orphan pin-spacers belonging to
      // other components and crash React on unmount with
      // "Failed to execute 'removeChild' on 'Node'".
      ctx.revert();
    };
  }, []);

  // Brand statement assembled from the company profile + global mirror.
  // Split into words so each one can scrub-fade individually without
  // forcing per-line positioning.
  const lines: { text: string; em?: boolean }[][] = [
    [
      { text: 'One' },
      { text: 'studio.' },
      { text: 'One' },
      { text: 'specification.', em: true }
    ],
    [
      { text: 'Kitchen,' },
      { text: 'wardrobe,' },
      { text: 'vanity,' }
    ],
    [
      { text: 'door' },
      { text: 'and' },
      { text: 'loose' },
      { text: 'furniture' }
    ],
    [
      { text: 'drawn' },
      { text: 'by' },
      { text: 'one' },
      { text: 'team', em: true },
      { text: '—' }
    ],
    [
      { text: 'manufactured' },
      { text: 'on' },
      { text: 'Industry' },
      { text: '4.0', em: true },
      { text: 'lines,' }
    ],
    [
      { text: 'installed' },
      { text: 'with' },
      { text: 'atelier', em: true },
      { text: 'care.' }
    ]
  ];

  const stickyImgs = [
    { src: IMG.kitchenCabinets, alt: 'Suofeiya kitchen cabinet', x: '4vw', y: '6vh', side: 'right' },
    { src: IMG.closet, alt: 'Suofeiya closet & wardrobe', x: '2vw', y: '24vh', side: 'left' },
    { src: IMG.bathroomVanity, alt: 'Suofeiya bathroom vanity', x: '8vw', y: '14vh', side: 'right' },
    { src: IMG.interiorDoor, alt: 'Suofeiya interior door', x: '5vw', y: '50vh', side: 'left' },
    { src: IMG.servicesHome, alt: 'Suofeiya whole-house design', x: '7vw', y: '56vh', side: 'right' }
  ];

  return (
    <section className="s2" ref={root} id="statement">
      <div className="s2-pin">
        {stickyImgs.map((it, i) => (
          <div
            key={it.src}
            className={`s2-img s2-img--${it.side}`}
            style={{
              top: it.y,
              [it.side === 'right' ? 'right' : 'left']: it.x
            } as React.CSSProperties}
          >
            <Image src={it.src} alt={it.alt} fill sizes="22vw" style={{ objectFit: 'cover' }} />
          </div>
        ))}

        <div className="s2-copy">
          {lines.map((line, li) => (
            <div key={li} className="s2-line">
              {line.map((w, wi) => (
                <span key={wi} className={`s2-word${w.em ? ' s2-word--em' : ''}`}>
                  {w.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

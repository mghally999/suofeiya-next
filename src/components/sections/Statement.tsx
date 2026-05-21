'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { IMG } from '@/lib/content';

/**
 * Pinned, scrubbed manifesto — Suofeiya.
 *
 * Layout: a centred paragraph held in place by CSS sticky
 * (`.s2-pin { position: sticky }`), with five floating frames
 * drifting across it as the user scrolls.
 *
 * Behaviour rules (lessons from earlier iterations):
 *   - Text opacity is FULL the whole time. Scrub-fading the words
 *     left them illegible at the top/bottom of the section — fixed.
 *   - Images slide in from below and STAY visible while the section
 *     is in view. No fade-out near the end (was making frames flash
 *     and vanish before the reader could see them).
 *   - The whole section is shortened to 220vh so the images don't
 *     drift forever before the page advances.
 */
export default function Statement() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const gsap = getGsap();
    getScrollTrigger();

    const ctx = gsap.context(() => {
      const imgs = gsap.utils.toArray<HTMLElement>('.s2-img', root.current!);

      // Start the images below + invisible, then ride them up + in
      // along the first 60% of the section's scroll. They stay put
      // for the rest of the section.
      imgs.forEach((img, i) => gsap.set(img, { yPercent: 80 + i * 14, opacity: 0 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });

      imgs.forEach((img, i) => {
        tl.to(img, { yPercent: -8 - i * 6, opacity: 1, duration: 0.4, ease: 'power2.out' }, i * 0.05);
      });
      // Hold images in place for the rest of the timeline — a dummy
      // tween is enough; without it ScrollTrigger marks the timeline
      // complete and the last frame can pop.
      tl.to({}, { duration: 0.4 });
    }, root);

    return () => ctx.revert();
  }, []);

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
    { src: IMG.kitchenCabinets, alt: 'Suofeiya kitchen cabinet', x: '4vw', y: '8vh', side: 'right' },
    { src: IMG.closet, alt: 'Suofeiya closet & wardrobe', x: '3vw', y: '28vh', side: 'left' },
    { src: IMG.bathroomVanity, alt: 'Suofeiya bathroom vanity', x: '8vw', y: '52vh', side: 'right' },
    { src: IMG.interiorDoor, alt: 'Suofeiya interior door', x: '5vw', y: '56vh', side: 'left' },
    { src: IMG.servicesHome, alt: 'Suofeiya whole-house design', x: '12vw', y: '14vh', side: 'right' }
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
                  {w.text}{' '}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

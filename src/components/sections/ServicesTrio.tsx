'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { IMG } from '@/lib/content';

/**
 * Two-column "OUR SERVICES" block. The two stacked headings and the
 * three staggered images each fade-up only when the section is at
 * least 30% on-screen — gating the reveal on intersection rather
 * than firing the moment the section enters the bottom of the
 * viewport.
 */
export default function ServicesTrio() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up, .reveal-line-inner');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            (e.target as HTMLElement).classList.add('is-visible', 'is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.15, 0.25, 0.4] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.12}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="services-trio" ref={root}>
      <div className="services-trio__text-tl">
        <div className="reveal-line-mask">
          <h2 className="font-display reveal-line-inner" style={{ fontSize: 'var(--fs-h2)', margin: 0 }}>
            OUR
          </h2>
        </div>
        <div className="reveal-line-mask" style={{ marginBottom: 24 }}>
          <h2
            className="font-display reveal-line-inner"
            style={{ fontSize: 'var(--fs-h2)', paddingLeft: 80, margin: 0 }}
          >
            SERVICES
          </h2>
        </div>
        <p className="fade-up" style={{ color: 'var(--text-dim)', maxWidth: 360, fontSize: 15, lineHeight: 1.7 }}>
          A leading customized-furniture manufacturer since 1981, Suofeiya delivers Kitchen Cabinet, Closet & Wardrobe,
          Bathroom Vanity, Whole-House Design, Interior Door, Loose Furniture and Hardware — designed by one studio,
          manufactured on Industry 4.0 lines, installed by our own crews.
        </p>
      </div>

      <div className="services-trio__images">
        <figure className="services-trio__img services-trio__img--1 fade-up">
          <Image
            src={IMG.kitchenCabinets}
            alt="Kitchen Cabinet — Suofeiya custom"
            fill
            sizes="(max-width: 900px) 33vw, 22vw"
            style={{ objectFit: 'cover' }}
          />
        </figure>
        <figure className="services-trio__img services-trio__img--2 fade-up">
          <Image
            src={IMG.closet}
            alt="Closet & Wardrobe — Suofeiya whole-house joinery"
            fill
            sizes="(max-width: 900px) 33vw, 22vw"
            style={{ objectFit: 'cover' }}
          />
        </figure>
        <figure className="services-trio__img services-trio__img--3 fade-up">
          <Image
            src={IMG.bathroomVanity}
            alt="Bathroom Vanity — Suofeiya"
            fill
            sizes="(max-width: 900px) 33vw, 22vw"
            style={{ objectFit: 'cover' }}
          />
        </figure>
      </div>

      <div className="services-trio__text-br">
        <p className="fade-up" style={{ color: 'var(--text-dim)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          One studio, end-to-end. From the DIYHome 3D drawing through 8 manufacturing bases to a site-trained
          installation crew — a single specification carries through every panel, door and handle.
        </p>
        <Link href="/services" className="link-underline">
          Explore our services
        </Link>
      </div>
    </section>
  );
}

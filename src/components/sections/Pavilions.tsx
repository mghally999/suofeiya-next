'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { pavilions } from '@/lib/content';

/**
 * VR Showroom rail — A1 Chic Living, A2 Vogue Life, B1 Luxury and
 * the Interior Door Showroom. Tiles are gated to fade up only when
 * they are at least 25% inside the viewport.
 */
export default function Pavilions() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.2, 0.25, 0.5] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="pavilions" ref={root} aria-label="Suofeiya VR Showrooms & Pavilions">
      <div className="pavilions__inner">
        <div className="pavilions__head">
          <h2 className="font-display fade-up">
            VR <em>Showroom</em> &amp; Pavilions
          </h2>
          <p className="fade-up">
            Explore the full Suofeiya living experience — Chic Living, Vogue Life, Luxury Pavilion and the dedicated
            Interior Door showroom, drawn for you in 3D before a single board is cut.
          </p>
        </div>
        <div className="pavilions__grid">
          {pavilions.map((p) => (
            <Link key={p.tag + p.title} href={p.href} className="pavilion fade-up" data-cursor="enter">
              <Image src={p.image} alt={p.title} fill sizes="(max-width: 900px) 50vw, 24vw" style={{ objectFit: 'cover' }} />
              <div className="pavilion__overlay">
                <span className="tag">Pavilion {p.tag}</span>
                <h3>{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

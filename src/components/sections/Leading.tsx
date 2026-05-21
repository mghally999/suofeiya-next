'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { IMG } from '@/lib/content';

export default function Leading() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !root.current) return;
    const targets = root.current.querySelectorAll<HTMLElement>('.reveal-line-inner, .fade-up');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.3) {
            (e.target as HTMLElement).classList.add('is-visible', 'is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: [0, 0.2, 0.3, 0.5] }
    );
    targets.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className="leading" ref={root}>
      <div className="leading__bg">
        <Image src={IMG.exterior} alt="Suofeiya manufacturing exterior" fill sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="leading__content">
        <h2>
          <span className="reveal-line-mask">
            <span className="reveal-line-inner">LEADING</span>
          </span>
          <span className="reveal-line-mask">
            <span className="reveal-line-inner indent">
              the <em style={{ fontStyle: 'italic', color: 'var(--brand-burgundy-soft)' }}>WHOLE&nbsp;HOUSE</em>
            </span>
          </span>
        </h2>
        <div className="leading__card fade-up">
          <Image
            src={IMG.team}
            alt="Suofeiya studio — design, engineer, install"
            width={420}
            height={560}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        <p className="fade-up">
          Founded in 1981, Suofeiya is the leading customized-furniture manufacturer with 14,906 employees, 4,000+ showrooms,
          15,000+ completed projects and 8 manufacturing bases worldwide. One studio that draws, manufactures and installs
          every room of your home — under one specification, one supply-chain handshake, one quality standard.
        </p>
        <Link href="/studio" className="link-underline">
          About Suofeiya
        </Link>
      </div>
    </section>
  );
}

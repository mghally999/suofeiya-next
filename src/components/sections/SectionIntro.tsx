'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Props {
  topLine: string;
  bottomLine: string;
  indent?: number;
  body: string;
  cta: { label: string; href: string };
}

export default function SectionIntro({ topLine, bottomLine, indent = 100, body, cta }: Props) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = root.current?.querySelectorAll<HTMLElement>('.reveal-line-inner');
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.12}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="section-intro container" ref={root}>
      <h2 className="font-display">
        <span className="reveal-line-mask">
          <span className="reveal-line-inner">{topLine}</span>
        </span>
        <span className="reveal-line-mask">
          <span className="reveal-line-inner" style={{ paddingLeft: indent }}>
            {bottomLine}
          </span>
        </span>
      </h2>
      <p>{body}</p>
      <Link href={cta.href} className="link-underline">
        {cta.label}
      </Link>
    </div>
  );
}

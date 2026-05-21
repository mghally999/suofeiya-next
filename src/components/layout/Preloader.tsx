'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Preloader uses the real SUOFEIYA brand PNG so the mark is
 * pixel-identical to the header. Single 7 KB asset → no font
 * dependency, no flash of unstyled brand.
 *
 * Gated behind sessionStorage so it shows once per session and
 * never re-covers heroes on client-side nav (§1 of the diff brief).
 *
 * Timer:
 *   - 500 ms on touch viewports — fastest first-paint we can
 *     justify before the mark feels jarring.
 *   - 700 ms on desktop where users are more forgiving of a brand
 *     beat.
 */
const SESSION_KEY = '__sf_preloader_shown';

export default function Preloader() {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hidden) return;
    const isTouch =
      typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const t = setTimeout(
      () => {
        setHidden(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* private-mode quotas — fine to ignore */
        }
      },
      isTouch ? 500 : 700
    );
    return () => clearTimeout(t);
  }, [hidden]);

  return (
    <div className={`preloader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <Image
        src="/logo/sfylogo.png"
        alt="Suofeiya"
        width={400}
        height={60}
        priority
        sizes="400px"
        style={{
          height: 'clamp(48px, 8vw, 88px)',
          width: 'auto',
          imageRendering: 'auto'
        }}
      />
      <div className="preloader__sub">Crafting Timeless Tailored Spaces · Since 1981</div>
    </div>
  );
}

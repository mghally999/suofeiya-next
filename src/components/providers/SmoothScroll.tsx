'use client';

import { useEffect } from 'react';
import { getGsap, getScrollTrigger } from '@/lib/gsap-client';
import { SinglyLinkedList } from '@/lib/ds';

/**
 * Wires Lenis to ScrollTrigger and runs a singly-linked-list scheduler of
 * per-frame callbacks so we hit the GPU compositor at most once per frame.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: { raf: (t: number) => void; on: (e: string, fn: () => void) => void; destroy: () => void } | null = null;
    let stopped = false;

    const tasks = new SinglyLinkedList<(time: number) => void>();

    (async () => {
      const mod = await import('lenis');
      const Lenis = mod.default;
      const gsap = getGsap();
      const ScrollTrigger = getScrollTrigger();

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
      }) as unknown as typeof lenis;

      lenis!.on('scroll', () => ScrollTrigger.update());

      const drive = (time: number) => {
        if (stopped) return;
        lenis!.raf(time * 1000);
        tasks.forEach((fn) => fn(time));
      };
      gsap.ticker.add(drive);
      gsap.ticker.lagSmoothing(0);
    })().catch(() => {
      /* silent — falls back to native scroll */
    });

    return () => {
      stopped = true;
      tasks.clear();
      lenis?.destroy();
    };
  }, []);

  return null;
}

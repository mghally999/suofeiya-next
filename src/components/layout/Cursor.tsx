'use client';

import { useEffect, useRef } from 'react';

/**
 * Single burgundy cursor — the colour matches the cube in the
 * Suofeiya wordmark (the brand's "O"). Lerps toward the pointer at
 * ~0.18 stiffness so the dot trails the mouse, and inflates with a
 * 1px ring whenever it hovers an `<a>`, `<button>` or any element
 * with `data-cursor`. The native cursor is hidden globally in
 * globals.css for hover-capable pointers.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!labelRef.current || !dotRef.current) return;
      const interactive = target?.closest('a, button, [role="button"], [data-cursor]');
      const label = interactive?.getAttribute('data-cursor') ?? '';
      if (interactive) {
        dotRef.current.classList.add('is-hover');
        labelRef.current.textContent = label || (target?.closest('a') ? 'view' : '');
        if (label || target?.closest('a')) labelRef.current.classList.add('is-visible');
      } else {
        dotRef.current.classList.remove('is-hover');
        labelRef.current.classList.remove('is-visible');
      }
    };

    const tick = () => {
      if (!running) return;
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;
      if (dotRef.current) {
        const w = dotRef.current.classList.contains('is-hover') ? 22 : 7;
        dotRef.current.style.transform = `translate3d(${curX - w}px, ${curY - w}px, 0)`;
      }
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${curX + 22}px, ${curY - 6}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={dotRef} aria-hidden />
      <div className="cursor-label" ref={labelRef} aria-hidden />
    </>
  );
}

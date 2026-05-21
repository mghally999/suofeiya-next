'use client';

/**
 * Single GSAP/ScrollTrigger registration point. Imported only on the client.
 * Components call `getGsap()` and receive the same registered instance.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function getGsap(): typeof gsap {
  if (typeof window === 'undefined') return gsap;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export function getScrollTrigger(): typeof ScrollTrigger {
  if (typeof window !== 'undefined' && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return ScrollTrigger;
}

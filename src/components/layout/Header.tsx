'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { navLeft, navRight } from '@/lib/content';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

/**
 * Header carries an explicit `data-scrolled` flag once the page is
 * scrolled past the hero. In the unscrolled state the bar overlays a
 * dark scrim against the hero image; once scrolled it swaps to a
 * solid cream background with dark text. This replaces the previous
 * mix-blend-mode hack which was invisible against light frames.
 *
 * Dropdowns are JS-controlled: hovering the trigger opens the menu,
 * and the menu closes only when the pointer leaves *both* the
 * trigger and the menu itself. A short close-timeout swallows the
 * gap between the trigger and the menu so the user can move into
 * the menu without it snapping shut. The previous CSS-only version
 * relied on `:focus-within`, which kept the menu open whenever a
 * link inside still had focus — even with the mouse far away.
 */
type NavItem = (typeof navLeft)[number] | (typeof navRight)[number];

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const children = 'children' in item ? item.children : undefined;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  // The nav array is typed `as const`, so TS narrows `children.length`
  // to a literal `5 | 7` and a `=== 0` check looks impossible. Coerce
  // through `Array` to allow the runtime guard.
  if (!children || (children as ReadonlyArray<unknown>).length === 0) {
    return <Link href={item.href}>{item.label}</Link>;
  }

  return (
    <div
      className={`nav-dropdown${open ? ' is-open' : ''}`}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Link href={item.href} className="nav-dropdown__trigger" onClick={() => setOpen(false)}>
        {item.label}
        <span aria-hidden style={{ fontSize: '10px', marginLeft: 2 }}>
          ▾
        </span>
      </Link>
      <div
        className="nav-dropdown__menu"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        aria-hidden={!open}
      >
        {(children as ReadonlyArray<{ href: string; label: string }>).map((c) => (
          <Link key={c.href + c.label} href={c.href} onClick={() => setOpen(false)}>
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="site-header" id="siteHeader" data-scrolled={scrolled ? 'true' : 'false'}>
        <nav className="site-header__nav-left hidden lg:flex">
          {navLeft.map((item) => (
            <NavDropdown key={item.label} item={item} />
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden text-[13px] uppercase tracking-[0.06em]"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>

        <Logo />

        <nav className="site-header__nav-right hidden lg:flex">
          {navRight.map((item) => (
            <NavDropdown key={item.label} item={item} />
          ))}
        </nav>

        <Link href="/contact" className="site-header__contact lg:hidden">
          Contact
        </Link>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

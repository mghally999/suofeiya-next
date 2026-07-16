"use client";

import { useEffect } from "react";
import Link from "next/link";
import { nav } from "@/lib/content";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <aside
      className={`mobile-menu${open ? " is-open" : ""}`}
      aria-hidden={!open}
    >
      <button type="button" className="mobile-menu__close" onClick={onClose}>
        Close
      </button>
      {nav.flatMap((item) => {
        const links = [
          <Link key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </Link>,
        ];
        if ("children" in item && item.children) {
          // Nav is `as const`, so `c.href` is narrowed to the literal
          // sub-page hash strings and TS thinks the comparison against
          // the parent href is impossible. Widen via `string` so the
          // de-dupe filter actually compiles.
          (item.children as ReadonlyArray<{ href: string; label: string }>)
            .filter((c) => c.href !== (item.href as string))
            .forEach((c) =>
              links.push(
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={onClose}
                  className="text-[24px] tracking-[0.04em] opacity-70"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {c.label}
                </Link>,
              ),
            );
        }
        return links;
      })}
    </aside>
  );
}

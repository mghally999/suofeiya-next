import Link from 'next/link';

/**
 * Suofeiya wordmark — strictly matches the brand lock-up shown
 * in the reference photograph:
 *
 *   S U [burgundy 3D cube] F E I Y A
 *
 * Implementation:
 * - Single DOM node (no duplicate light/dark variants — the old
 *   two-variant approach was rendering both because inline `display`
 *   styles beat the CSS visibility toggle).
 * - Letters use Manrope at weight 200 for the brand's thin-sans
 *   geometric feel, rendered in `currentColor` so the header can
 *   switch tone simply by changing `color` on `.site-header`.
 * - Cube is an inline SVG with three burgundy faces — the colour is
 *   fixed regardless of header state because the cube is the brand
 *   mark itself.
 */
function Cube({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden
      style={{ flex: '0 0 auto', display: 'block' }}
    >
      <polygon points="22,2 42,12 22,22 2,12" fill="#a8302e" />
      <polygon points="2,12 22,22 22,42 2,32" fill="#5a0d0d" />
      <polygon points="42,12 22,22 22,42 42,32" fill="#8b1a1a" />
      <line x1="22" y1="2" x2="22" y2="22" stroke="#3d0808" strokeWidth="0.6" opacity="0.55" />
      <line x1="2" y1="12" x2="22" y2="22" stroke="#3d0808" strokeWidth="0.4" opacity="0.4" />
      <line x1="42" y1="12" x2="22" y2="22" stroke="#3d0808" strokeWidth="0.4" opacity="0.4" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" aria-label="Suofeiya — home" className="site-header__brand brand-mark">
      <span className="brand-mark__letters" aria-hidden>
        SU
      </span>
      <Cube size={28} />
      <span className="brand-mark__letters" aria-hidden>
        FEIYA
      </span>
      <span className="sr-only">Suofeiya</span>
    </Link>
  );
}

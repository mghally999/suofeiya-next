import Link from 'next/link';

/**
 * Suofeiya wordmark — strictly matches the brand lock-up:
 *
 *   S U [burgundy 3D cube] F E I Y A
 *
 * The cube is a clean isometric box with three flat faces (top
 * lighter, right mid, left dark) — no decorative grid lines, no
 * inner shadows, just the three polygons that form the brand mark.
 * Sizes are tuned so the cube reads at the cap-height of the
 * letters at every render size.
 *
 * Letters use Manrope weight 200 (thin geometric sans) at wide
 * letter-spacing, rendered in currentColor so the header can swap
 * the tone simply by changing `color` on `.site-header`.
 */
function Cube({ size = 28, ariaHidden = true }: { size?: number; ariaHidden?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      aria-hidden={ariaHidden}
      style={{ flex: '0 0 auto', display: 'block' }}
    >
      {/* Top face — lightest. */}
      <polygon points="30,3 56,15 30,27 4,15" fill="#a8302e" />
      {/* Left face — darkest, sits in shadow. */}
      <polygon points="4,15 30,27 30,57 4,45" fill="#4d0a0a" />
      {/* Right face — mid burgundy. */}
      <polygon points="56,15 30,27 30,57 56,45" fill="#8b1a1a" />
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

export { Cube };

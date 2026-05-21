import Link from 'next/link';

export default function NotFound() {
  return (
    <section style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '120px 32px' }}>
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        <p className="eyebrow" style={{ marginBottom: 24 }}>
          404 · Not found
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1.05, margin: '0 0 24px' }}>
          The page <em style={{ fontStyle: 'italic' }}>moved</em>.
        </h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 40 }}>
          Try the projects or return to the studio.
        </p>
        <Link href="/" className="link-underline">
          Back to home
        </Link>
      </div>
    </section>
  );
}

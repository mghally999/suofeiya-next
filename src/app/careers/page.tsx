import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Suofeiya studio.'
};

const roles = [
  { title: 'Senior Interior Designer', type: 'Full-time', location: 'Dubai' },
  { title: 'Project Architect', type: 'Full-time', location: 'Dubai' },
  { title: 'Procurement Manager', type: 'Full-time', location: 'Dubai' },
  { title: 'Junior 3D Visualiser', type: 'Full-time', location: 'Guangzhou' },
  { title: 'CAD Technician — Joinery', type: 'Full-time', location: 'Guangzhou' }
];

export default function CareersPage() {
  return (
    <>
      <header className="page-hero">
        <p className="page-hero__eyebrow">Careers</p>
        <h1 className="page-hero__title">
          JOIN THE <em style={{ fontStyle: 'italic' }}>STUDIO</em>
        </h1>
        <p className="page-hero__sub">
          We hire designers, architects, joiners and project managers who share a love for considered, enduring work.
        </p>
      </header>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 140px' }}>
        <ul className="awards-list" style={{ borderTop: '1px solid var(--line)', listStyle: 'none', padding: 0, margin: 0 }}>
          {roles.map((r) => (
            <li key={r.title}>
              <span>{r.title}</span>
              <span className="meta">
                {r.type} · {r.location}
              </span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 80 }}>
          <Link href="/contact" className="link-underline">
            Send us your portfolio
          </Link>
        </div>
      </section>
    </>
  );
}

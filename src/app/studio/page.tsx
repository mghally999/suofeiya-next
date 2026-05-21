import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IMG, studio, milestones, manufacturingBases } from '@/lib/content';
import Directors from '@/components/sections/Directors';

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Suofeiya — a leading customized-furniture studio since 1981. 8 manufacturing bases, 4,000+ showrooms, 14,906 staff, 15,000+ delivered projects.'
};

export default function StudioPage() {
  return (
    <>
      <section className="studio-hero">
        <Image src={IMG.team} alt="Suofeiya studio" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="studio-hero__title">OUR STUDIO</div>
      </section>

      <section className="studio-statement">
        <p className="eyebrow" style={{ marginBottom: 32 }}>
          Type · Studio · {studio.city}, {studio.country}
        </p>
        <h2 className="font-display">
          WHERE REFINEMENT, <em style={{ fontStyle: 'italic', color: 'var(--brand-burgundy)' }}>INNOVATION</em>
          <br />
          AND <em style={{ fontStyle: 'italic', color: 'var(--brand-burgundy)' }}>CRAFTSMANSHIP</em> CONVERGE
        </h2>
        <p>
          The Suofeiya ethos is centred on the meticulous creation of whole-house luxury — underpinned by exceptional
          levels of thought, material discipline and atelier-grade joinery. Founded in 1981, listed on the Shenzhen Stock
          Exchange in 2011, and now operating 8 manufacturing bases across 1,000,000+ m² of plants.
        </p>
      </section>

      <Directors />

      <section className="studio-band" id="history">
        <div className="studio-band__inner">
          <p className="studio-band__eyebrow">— 02 · History &amp; Development</p>
          <h2 className="font-display">
            Since <em style={{ fontStyle: 'italic', color: 'var(--brand-burgundy)' }}>1981</em>.
          </h2>
          <ol className="studio-band__list">
            {milestones.map((m) => (
              <li key={m.year}>
                <span className="studio-band__year font-display">{m.year}</span>
                <div>
                  <h3 className="font-display">{m.title}</h3>
                  <p>{m.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="studio-band studio-band--dark" id="manufacturing">
        <div className="studio-band__inner">
          <p className="studio-band__eyebrow">— 03 · Manufacturing Network</p>
          <h2 className="font-display">
            8 bases. <em style={{ fontStyle: 'italic', color: 'var(--brand-burgundy-soft)' }}>One specification.</em>
          </h2>
          <ul className="studio-band__bases">
            {manufacturingBases.map((b) => (
              <li key={b.city}>
                <span className="studio-band__city font-display">{b.city}</span>
                <span className="studio-band__region">{b.region}</span>
                <span className="studio-band__focus">{b.focus}</span>
                <span className="studio-band__area font-display">{b.area}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 120px' }}>
        <Image src={IMG.livingRoom} alt="Studio interior" width={1600} height={900} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
      </section>

      <section style={{ maxWidth: 880, margin: '0 auto', padding: '0 32px 160px' }}>
        <p className="eyebrow" style={{ marginBottom: 24 }}>
          The Studio
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 1.45 }}>
          Founded to redefine customized luxury through a seamless integration of design, manufacture and installation,
          Suofeiya brings specialists, collaborators and craftspeople into one cohesive studio. Every project is
          shepherded by a senior designer from first conversation to final handover.
        </p>
        <div style={{ marginTop: 60 }}>
          <Link href="/careers" className="link-underline">
            View franchise & careers
          </Link>
        </div>
      </section>
    </>
  );
}

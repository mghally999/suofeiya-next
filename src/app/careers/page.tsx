import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IMG } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Franchise & Careers',
  description: 'Join the Suofeiya studio — interior designers, architects, manufacturing engineers, project managers and franchise partners.'
};

const roles = [
  { title: 'Senior Interior Designer', type: 'Full-time', location: 'Dubai' },
  { title: 'Project Architect', type: 'Full-time', location: 'Dubai' },
  { title: 'Procurement Manager', type: 'Full-time', location: 'Dubai' },
  { title: 'Junior 3D Visualiser', type: 'Full-time', location: 'Guangzhou' },
  { title: 'CAD Technician — Joinery', type: 'Full-time', location: 'Guangzhou' },
  { title: 'Franchise Partner Lead', type: 'B2B / B2C', location: 'Global' }
];

// Hand-picked Suofeiya mirror images for the page — manufacturing
// floor, showroom interior, and a project install shot. Sourced
// from public/cms/ (the bulk-downloaded global.suofeiya.com mirror).
const HERO_IMG = '/cms/23ac011c-a218-419e-8f16-5d81efab1232.jpg';
const SIDE_IMG_A = '/cms/8688782d-2c4c-4ead-8d2e-53515799bf70.jpg';
const SIDE_IMG_B = '/cms/689aaf19-c92a-4570-b3c2-a6112cf39810.jpg';

export default function CareersPage() {
  return (
    <>
      <section className="services-hero">
        <Image src={HERO_IMG} alt="Suofeiya studio — join the team" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-hero__scrim" aria-hidden />
        <h1 className="services-hero__title font-display services-hero__title--reveal">FRANCHISE &amp; CAREERS</h1>
      </section>

      <section className="services-intro">
        <h2 className="services-intro__statement font-display">
          BUILD <em>with</em> A STUDIO
          <br />
          THAT <em>draws,</em> MANUFACTURES
          <br />
          <em>and</em> INSTALLS <em>under</em> ONE ROOF.
        </h2>
        <div className="services-intro__copy">
          <p>
            Suofeiya hires designers, architects, manufacturing engineers, joiners and project managers who share a
            love for considered, enduring work. Our 14,906-strong global team works across 8 manufacturing bases and
            4,000+ showrooms — designing, drawing, fabricating and installing whole-house interiors on a single
            specification.
          </p>
          <p>
            We also welcome franchise partners — B2C retail showrooms and B2B apartment / hotel / villa program
            partners — into the Suofeiya network with whole-process training, brand support, the DIYHome 3D design
            stack and a designed showroom kit. Send us your portfolio or partnership profile and a senior member of
            the studio will reply within ten working days.
          </p>
        </div>
      </section>

      <section className="careers-roles">
        <div className="careers-roles__inner">
          <div className="careers-roles__list">
            <p className="careers-roles__label">— Open positions</p>
            <ul>
              {roles.map((r) => (
                <li key={r.title} className="careers-role">
                  <span className="careers-role__title font-display">{r.title}</span>
                  <span className="careers-role__meta">
                    {r.type} · {r.location}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 56 }}>
              <Link href="/contact" className="link-underline">
                Send us your portfolio
              </Link>
            </div>
          </div>
          <div className="careers-roles__media">
            <figure className="scroll-zoom">
              <Image src={SIDE_IMG_A} alt="Suofeiya showroom interior" width={720} height={900} sizes="(max-width: 900px) 100vw, 40vw" style={{ width: '100%', height: 'auto' }} />
            </figure>
            <figure className="careers-roles__media-b scroll-zoom">
              <Image src={SIDE_IMG_B} alt="Suofeiya manufacturing detail" width={520} height={400} sizes="(max-width: 900px) 100vw, 30vw" style={{ width: '100%', height: 'auto' }} />
            </figure>
          </div>
        </div>
      </section>

      <section className="services-video">
        <Image src={IMG.servicesHome} alt="Inside the Suofeiya studio" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-video__scrim" aria-hidden />
        <div className="services-video__overlay">
          <span className="services-video__eyebrow">One studio · One specification</span>
          <p className="font-display">Designing the way we manufacture.</p>
        </div>
      </section>
    </>
  );
}

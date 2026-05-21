import type { Metadata } from 'next';
import Image from 'next/image';
import InsightsClient from './InsightsClient';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Suofeiya Press & Insights — whole-house design, Industry 4.0 manufacturing, DIYHome 3D, NAF eco-friendly board and B2B partnership programs.'
};

const HERO_IMG = '/cms/9c20609e-d50c-4f01-8930-545aba8b5f60.jpg';

export default function InsightsPage() {
  return (
    <>
      <section className="services-hero">
        <Image
          src={HERO_IMG}
          alt="Suofeiya Journal — press and insights"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="services-hero__scrim" aria-hidden />
        <h1 className="services-hero__title font-display services-hero__title--reveal">THE JOURNAL</h1>
      </section>

      <section className="services-intro">
        <h2 className="services-intro__statement font-display">
          PRESS, <em>process,</em> POSITION —
          <br />
          THE INSIDE <em>view</em> OF
          <br />
          THE SUOFEIYA STUDIO.
        </h2>
        <div className="services-intro__copy">
          <p>
            Go beyond the finished space. Insights from the design floor, the manufacturing line and the press cycle:
            whole-house design philosophy, Industry 4.0 manufacturing tours, the DIYHome 3D specification flow, NAF /
            SGS material standards and the B2B apartment + hotel partnership playbook.
          </p>
          <p>
            Filter by industry (Residential / Commercial / Development) and family (Insights / Press) to narrow the
            grid below. Every card opens a long-form piece with project galleries, drawings and source links.
          </p>
        </div>
      </section>

      <InsightsClient />
    </>
  );
}

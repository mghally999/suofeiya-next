import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';
import { processSteps, awards, IMG } from '@/lib/content';
import Image from 'next/image';
import AwardsList from '@/components/sections/AwardsList';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Whole-house design, Kitchen Cabinet, Closet & Wardrobe, Bathroom Vanity, Interior Door, Loose Furniture and Hardware — one Suofeiya studio, one specification.'
};

/**
 * Services page — patterned on the page-level addendum §2.
 *
 * Sequence:
 *   1. Hero (100vh full-bleed image, centred white SERVICES overlay)
 *   2. Left-aligned 3-line statement
 *   3. Right-aligned 2-column body paragraphs
 *   4. 5 split-pane service blocks (ServicesClient)
 *   5. Full-bleed image block (we have no video asset)
 *   6. A REFINED PROCESS — Suofeiya delivery loop on charcoal
 *   7. RECOGNITION + AWARDS lists with draw-on dividers (AwardsList)
 *   8. DESIGNED WITH INTENTION — sustainability block
 */
export default function ServicesPage() {
  return (
    <>
      <section className="services-hero">
        <Image src={IMG.servicesHome} alt="Suofeiya — services" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-hero__scrim" aria-hidden />
        <h1 className="services-hero__title font-display">SERVICES</h1>
      </section>

      <section className="services-intro">
        <h2 className="services-intro__statement font-display">
          REALISATION <em>of</em> EXTRAORDINARY
          <br />
          FORM <em>and an</em> UNCOMPROMISING
          <br />
          DEVOTION <em>to</em> MATERIAL.
        </h2>
        <div className="services-intro__copy">
          <p>
            Suofeiya is a leading customized-furniture studio renowned for crafting whole-house spaces that combine
            individuality, refinement and enduring quality. From elegant residences to apartment programs, hotel suites
            and landmark developments, we create environments that balance function and beauty while reflecting the
            unique brief of each client. As a global category leader since 1981, our work spans the full spectrum of
            design and delivery — from initial concept and DIYHome 3D walkthrough to manufacturing, bespoke joinery,
            tooling installation and quality control.
          </p>
          <p>
            With in-house expertise across Kitchen Cabinet, Closet &amp; Wardrobe, Bathroom Vanity, Whole-House Design,
            Interior Door, Loose Furniture and Hardware, we offer a fully integrated service so every project is
            cohesive, meticulously executed and tailored to its purpose. We manufacture on Industry 4.0 lines across 8
            global bases, ship boards at NAF / SGS formaldehyde-free grade, and close the loop with site-trained
            installation crews. Every decision is made with intention — material longevity, environmental compliance and
            the story a space will tell.
          </p>
        </div>
      </section>

      <ServicesClient />

      <section className="services-video">
        <Image src={IMG.delivery} alt="Suofeiya manufacturing & delivery" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-video__scrim" aria-hidden />
        <div className="services-video__overlay">
          <span className="services-video__eyebrow">Inside the studio</span>
          <p className="font-display">DIYHome 3D → 8 Bases → Site Install</p>
        </div>
      </section>

      <section className="process">
        <h2>A REFINED PROCESS</h2>
        <div className="process__grid">
          {processSteps.map((s) => (
            <div key={s.title} className="process__step">
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <AwardsList recognition={awards.slice(0, 3)} awards={awards.slice(3)} />

      <section className="intention">
        <div className="intention__inner">
          <h2>
            DESIGNED WITH
            <br />
            <em style={{ fontStyle: 'italic' }}>INTENTION</em>
          </h2>
          <div className="intention__body">
            <p className="eyebrow" style={{ marginBottom: 16 }}>
              Sustainability ethos · NAF + SGS
            </p>
            <p>
              At Suofeiya, designing with intention means creating spaces that honour both our clients' vision and the
              world we share. Our boards reach NAF (No Added Formaldehyde) and SGS certification — category-leading
              environmental standards — and our 8 manufacturing bases run ISO-aligned environmental management.
            </p>
            <p>
              From responsibly sourced timber to formaldehyde-free engineered board, we partner only with suppliers who
              share our commitment to quality and sustainability.
            </p>
            <Image
              src={IMG.intention}
              alt="Designed with intention"
              width={520}
              height={320}
              style={{ marginTop: 24, width: '100%', height: 'auto', maxWidth: 520 }}
            />
          </div>
        </div>
        <div className="intention__badge">
          NAF<span>Eco-friendly standard</span>
        </div>
      </section>
    </>
  );
}

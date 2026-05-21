import type { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from './ContactForm';
import { studio } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Begin a conversation with the Suofeiya studio — Guangzhou HQ + 8 manufacturing bases worldwide.'
};

const HERO_IMG = '/cms/923d70ab-9239-44a3-b71b-424d5fc6707f.jpg';
const STUDIO_IMG = '/cms/0ae0492d-bd47-4a3f-88b5-a354ec20681d.jpg';

export default function ContactPage() {
  return (
    <>
      <section className="services-hero">
        <Image src={HERO_IMG} alt="Suofeiya — contact the studio" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div className="services-hero__scrim" aria-hidden />
        <h1 className="services-hero__title font-display services-hero__title--reveal">CONTACT</h1>
      </section>

      <section className="contact-page">
        <div className="contact-page__intro">
          <p className="contact-page__eyebrow">— Begin a conversation</p>
          <h2 className="font-display">
            Tell us about your <em>project</em>.
          </h2>
          <p className="contact-page__sub">
            B2B partnerships, franchise enquiries, design briefs and press requests all reach the right desk. A senior
            member of the studio replies within ten working days.
          </p>
        </div>

        <div className="contact-grid">
          <ContactForm />
          <aside className="contact-info">
            <figure className="contact-info__media scroll-zoom">
              <Image src={STUDIO_IMG} alt="Suofeiya studio interior" width={720} height={900} sizes="(max-width: 900px) 100vw, 40vw" style={{ width: '100%', height: 'auto' }} />
            </figure>
            <div>
              <h3>Studio</h3>
              <p>
                {studio.city}, {studio.country}
                <br />
                {studio.street}
              </p>
            </div>
            <div>
              <h3>Reach</h3>
              <p>
                <a href={`mailto:${studio.email}`}>{studio.email}</a>
                <br />
                <a href={`tel:${studio.phone.replace(/\s+/g, '')}`}>{studio.phone}</a>
              </p>
            </div>
            <div>
              <h3>Follow</h3>
              <p>
                {studio.socials.map((s, i) => (
                  <span key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                    {i < studio.socials.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

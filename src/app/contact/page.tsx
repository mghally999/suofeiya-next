import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { studio } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Begin a conversation with the Suofeiya studio.'
};

export default function ContactPage() {
  return (
    <section className="contact-page">
      <h1>
        GET IN <em style={{ fontStyle: 'italic' }}>TOUCH</em>
      </h1>
      <div className="contact-grid">
        <ContactForm />
        <aside className="contact-info">
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
  );
}

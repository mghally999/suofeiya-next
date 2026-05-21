import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Project Portfolio',
  description:
    'Selected Suofeiya project work — apartment, hotel, villa and office programs delivered on a single whole-house specification.'
};

export default function ProjectsPage() {
  return (
    <>
      <section className="projects-hero">
        <h1 className="projects-hero__title font-display">
          Project <em>Portfolio</em>
        </h1>
        <p className="projects-hero__sub">
          15,000+ delivered B2B projects worldwide — selected work across the Apartment, Hotel, Villa and Office
          programs, all built on a single Suofeiya specification.
        </p>
      </section>
      <ProjectsClient />
    </>
  );
}

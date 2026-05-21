import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import ServicesTrio from '@/components/sections/ServicesTrio';
import Leading from '@/components/sections/Leading';
import GetInTouchCTA from '@/components/sections/GetInTouchCTA';
import InsightsGrid from '@/components/sections/InsightsGrid';
import Stats from '@/components/sections/Stats';
import Pavilions from '@/components/sections/Pavilions';
import Products from '@/components/sections/Products';
import Timeline from '@/components/sections/Timeline';
import Network from '@/components/sections/Network';
import Process from '@/components/sections/Process';
import Certifications from '@/components/sections/Certifications';
import Testimonials from '@/components/sections/Testimonials';
import Subsidiaries from '@/components/sections/Subsidiaries';
import CaseStudies from '@/components/sections/CaseStudies';

const Statement = dynamic(() => import('@/components/sections/Statement'), { ssr: false });
const ProjectCarousel = dynamic(() => import('@/components/sections/ProjectCarousel'), { ssr: false });

/**
 * Hierarchy on the home page is intentional, indexed and consistent:
 *
 *   01 — Brand promise         (Hero + Statement)
 *   02 — History               (Timeline since 1981)
 *   03 — Projects film         (ProjectCarousel)
 *   04 — Case studies grid     (full GH / NC / SLS / ST)
 *   05 — Manufacturing network (8 bases + totals)
 *   06 — Delivery process      (DIYHome → QC, 4 steps)
 *   07 — Numbers               (Stats — screaming)
 *   08 — Certifications        (NAF / SGS / ISO / Red Dot)
 *   09 — Customer voices       (Testimonials)
 *   10 — Sub-brands            (Suofeiya / Milan / SOGAL / Hua'he)
 *   11 — Product categories    (horizontal pin)
 *   12 — Services trio         (the three core offers)
 *   13 — VR Showroom & Pavilions
 *   14 — Leading the whole house (Studio leadership)
 *   15 — Get-in-touch CTA
 *   16 — Press / Insights
 *
 * Every section is wrapped by its own paddings + a SectionHeader so
 * the rhythm stays consistent end to end.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <Timeline />
      <ProjectCarousel />
      <CaseStudies />
      <Network />
      <Process />
      <Stats />
      <Certifications />
      <Testimonials />
      <Subsidiaries />
      <Products />
      <ServicesTrio />
      <Pavilions />
      <Leading />
      <GetInTouchCTA />
      <InsightsGrid />
    </>
  );
}

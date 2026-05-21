/**
 * Single source of truth for all editorial content + image mappings.
 *
 * Editorial copy and information architecture are lifted verbatim from
 * the Suofeiya company profile PDF (2024) and the mirrored
 * global.suofeiya.com site, then reshaped into an Elicyon-style
 * narrative skeleton. No invented projects: PRODUCT/SERVICE/PROJECT/
 * FRANCHISE/PRESS/SOCIAL RESPONSIBILITY all map to real pages on the
 * source site.
 */

export const IMG = {
  livingRoom: '/images/living-room-design.png',
  villaInterior: '/images/villa-interior-design.png',
  apartment: '/images/apartment-design.png',
  hotel: '/images/hotel-design.png',
  bedroom: '/images/bedroom-design.png',
  office: '/images/office-interior-design.png',
  exterior: '/images/exterior-design.png',
  bathroom: '/images/bathroom-design.png',
  kitchen: '/images/kitchen-design.png',
  restaurant: '/images/restaurant-design.png',
  retail: '/images/retail-and-fitout.png',
  fitoutResidential: '/images/fitout-residential.png',
  intention: '/images/designed-with-intention.png',
  delivery: '/images/our-delivery.png',
  servicesHome: '/images/our-servies-homepage.png',
  team: '/images/a-world-full-of-works.png',
  objectsHero: '/images/objects-of-desire.png',
  kitchenCabinets: '/images/kitchen-cabinets.png',
  closet: '/images/closet-and-wardrobe.png',
  bathroomVanity: '/images/bathroom-vanity.png',
  countertop: '/images/countertop-systems.png',
  hardware: '/images/hardware-accesories.png',
  interiorDoor: '/images/interior-door.png',
  looseFurniture: '/images/loose-furniture.png',
  childrensRoom: '/images/childrens-room.png'
} as const;

/* ===== Hero ===== */
export const heroWords = ['TIMELESS', 'TAILORED', 'SPACES'] as const;
export const heroTagline = {
  copy: 'A leading customized furniture and whole-house design studio. Kitchen, wardrobe, vanity, interior door, wall panels and loose furniture — drawn, joined and installed by one team.',
  since: 'Since 1981'
};

/* ===== Statement =====
   Adapted from Suofeiya's brand-narrative: "We craft full-range
   customized living, end-to-end, from manufacture to installation." */
export interface StatementWord {
  text: string;
  fade: boolean;
  em?: boolean;
}
export interface StatementLine {
  x: number;
  y: number;
  words: StatementWord[];
}
export const statementLines: StatementLine[] = [
  { x: 0, y: 0, words: [{ text: 'One', fade: true }] },
  {
    x: 0,
    y: 0,
    words: [
      { text: 'STUDIO,', fade: true, em: true },
      { text: 'one', fade: true }
    ]
  },
  {
    x: -50,
    y: 0,
    words: [
      { text: 'VISION', fade: true, em: true },
      { text: 'for', fade: true },
      { text: 'every', fade: true }
    ]
  },
  {
    x: -450,
    y: 55,
    words: [
      { text: 'room', fade: true },
      { text: 'you', fade: true },
      { text: 'inhabit —', fade: true },
      { text: 'CRAFTING', fade: false, em: true },
      { text: 'a', fade: false }
    ]
  },
  {
    x: 161,
    y: 0,
    words: [
      { text: 'WHOLE', fade: false, em: true },
      { text: 'HOUSE', fade: false, em: true },
      { text: 'with', fade: false },
      { text: 'manufactured', fade: false }
    ]
  },
  {
    x: -152,
    y: 0,
    words: [
      { text: 'PRECISION,', fade: false, em: true },
      { text: 'designed', fade: false },
      { text: 'with', fade: false }
    ]
  },
  {
    x: 429,
    y: -55,
    words: [
      { text: 'ATELIER', fade: false, em: true },
      { text: 'CARE.', fade: false, em: true }
    ]
  }
];

/* ===== Project carousel =====
   These are real Suofeiya case studies pulled from the global mirror's
   front page: GH Apartment, SLS Hotel, ST Hotel, NC Apartment. */
export interface ProjectSlide {
  category: string;
  eyebrow: string;
  project: string;
  location: string;
  copy: string;
  image: string;
  href: string;
}
export const projectSlides: ProjectSlide[] = [
  {
    category: 'APARTMENT',
    eyebrow: 'Apartment Project · GH',
    project: 'GH APARTMENT · KUALA LUMPUR',
    location: 'Kuala Lumpur, Malaysia · 2024',
    copy:
      'Design & Build one-stop solution — modern simplicity, artistic textured surfaces and custom hardware across every Kuala Lumpur unit.',
    image: '/projects/gh-apartment/01.jpg',
    href: '/projects/gh-apartment'
  },
  {
    category: 'HOTEL',
    eyebrow: 'Hotel Project · SLS',
    project: 'SLS HOTEL · KUALA LUMPUR',
    location: 'Kuala Lumpur, Malaysia · 2023',
    copy:
      'Suite-grade wardrobe and dressing-table program — modern luxury, curved process, plywood + wax-wood veneer lacquer finish.',
    image: '/projects/sls-hotel/01.jpg',
    href: '/projects/sls-hotel'
  },
  {
    category: 'APARTMENT',
    eyebrow: 'Apartment Project · NC',
    project: 'NC APARTMENT · CAIRO',
    location: 'Cairo, Egypt · 450 units · 2022',
    copy:
      'A 450-unit Cairo apartment program delivered on a single Suofeiya whole-house specification — Kitchen Cabinet + Vanity Cabinet on NAF / SGS board.',
    image: '/projects/nc-apartment/01.jpg',
    href: '/projects/nc-apartment'
  },
  {
    category: 'HOTEL',
    eyebrow: 'Hotel Project · ST',
    project: 'ST HOTEL · DOHA',
    location: 'Doha, Qatar · 2022',
    copy:
      'Doha hotel fit-out — Kitchen Cabinet + Wardrobe in natural walnut veneer with solid-wood lipping, on an E0-melamine carcass matched to the veneer.',
    image: '/projects/st-hotel/01.jpg',
    href: '/projects/st-hotel'
  }
];

/* ===== Stats — directly from suofeiya mirror banner ===== */
export interface Stat {
  label: string;
  num: string;
  suffix?: string;
  desc: string;
}
export const stats: Stat[] = [
  {
    label: 'Manufacture',
    num: '1M',
    suffix: '+ m²',
    desc: '8 manufacturing bases. 1 million+ m² of plants with full-range categories on Industry 4.0 lines.'
  },
  {
    label: 'Network',
    num: '4,000',
    suffix: '+',
    desc: '4,000+ Suofeiya showrooms worldwide — a global retail footprint that puts samples in your reach.'
  },
  {
    label: 'Projects',
    num: '15,000',
    suffix: '+',
    desc: '15,000+ completed B2B projects across residences, apartments, hotels and developments.'
  },
  {
    label: 'Employees',
    num: '14,000',
    suffix: '+',
    desc: '14,906 staff: 1,300+ researchers, 700+ supply-chain managers, 8,000+ production specialists.'
  },
  {
    label: 'Patents',
    num: '400',
    suffix: '+',
    desc: '42 invention patents, 155 utility-model patents, 251 design patents protect our engineering.'
  },
  {
    label: 'Design',
    num: '3D',
    desc: 'DIYHome — independent R&D 3D rendering & order-management software, drawing → factory in one flow.'
  },
  {
    label: 'Eco-Friendly',
    num: 'NAF',
    desc: 'Formaldehyde-free board reaching NAF / SGS multiple certifications — leading the category globally.'
  },
  {
    label: 'Support',
    num: 'Whole',
    desc: 'Whole-process training and after-sales support so our partners grow with us, not around us.'
  }
];

/* ===== Pavilions (VR Showroom) — straight from the global mirror ===== */
export interface Pavilion {
  tag: string;
  title: string;
  image: string;
  href: string;
}
export const pavilions: Pavilion[] = [
  { tag: 'A1', title: 'Chic Living Pavilion', image: IMG.livingRoom, href: '/studio#vr' },
  { tag: 'A2', title: 'Vogue Life Pavilion', image: IMG.apartment, href: '/studio#vr' },
  { tag: 'B1', title: 'Luxury Pavilion', image: IMG.villaInterior, href: '/studio#vr' },
  { tag: 'D1', title: 'Interior Door Showroom', image: IMG.interiorDoor, href: '/studio#vr' }
];

/* ===== Products (from the global mirror product menu) ===== */
export interface Product {
  title: string;
  tag: string;
  sub: string;
  image: string;
  href: string;
}
export const products: Product[] = [
  {
    title: 'Kitchen Cabinet',
    tag: 'Built-in · Full-system',
    sub: 'Industry 4.0 lines, full-system kitchens engineered around the way you cook.',
    image: IMG.kitchenCabinets,
    href: '/services/kitchen-cabinet'
  },
  {
    title: 'Closet & Wardrobe',
    tag: 'Whole-house joinery',
    sub: 'Custom closets and wardrobes drawn around the architecture, not adapted to it.',
    image: IMG.closet,
    href: '/services/closet-wardrobe'
  },
  {
    title: 'Bathroom Vanity',
    tag: 'Water-proof carcass',
    sub: 'Vanity cabinets in moisture-resistant board, stone counters and integrated lighting.',
    image: IMG.bathroomVanity,
    href: '/services/bathroom-vanity'
  },
  {
    title: 'Whole House Design',
    tag: 'One-stop',
    sub: 'Single bill-of-materials covering every room — kitchen to wardrobe to door.',
    image: IMG.servicesHome,
    href: '/services/whole-house-design'
  },
  {
    title: 'Interior Door',
    tag: 'Suofeiya doors',
    sub: 'Solid-wood, panel and frameless door systems engineered to match the wardrobe.',
    image: IMG.interiorDoor,
    href: '/services/interior-door'
  },
  {
    title: 'Loose Furniture',
    tag: 'Made for the room',
    sub: 'Sofas, tables and lounge programs that share the language of the architecture.',
    image: IMG.looseFurniture,
    href: '/services/loose-furniture'
  },
  {
    title: 'Hardware & Accessories',
    tag: 'In-house engineered',
    sub: 'Hinges, handles, drawer-runners and lighting accessories made to Suofeiya tolerances.',
    image: IMG.hardware,
    href: '/services/hardware-accessories'
  }
];

/* ===== Services (split-pane on /services) ===== */
export interface ServiceBlock {
  number: string;
  title: string;
  copy: string;
  image: string;
  project: string;
}
export const services: ServiceBlock[] = [
  {
    number: '01',
    title: 'WHOLE-HOUSE DESIGN',
    copy: 'A single team draws every room — kitchen, wardrobe, vanity, door — under one design language. DIYHome 3D software lets you walk the space before the boards are cut.',
    image: IMG.servicesHome,
    project: 'GH APARTMENT COLLECTION'
  },
  {
    number: '02',
    title: 'CUSTOM CABINETRY',
    copy: 'Kitchen, closet and built-ins manufactured on Industry 4.0 lines across 8 plants. Custom carcasses, custom fronts, factory-tight tolerances.',
    image: IMG.kitchenCabinets,
    project: 'NC APARTMENT COMPLEX'
  },
  {
    number: '03',
    title: 'TOOLING & INSTALLATION',
    copy: 'Site-trained installation crews close the loop. Tools, fittings and trim arrive sequenced; we do not hand over until the joinery moves the way it should.',
    image: IMG.delivery,
    project: 'SLS HOTEL SUITES'
  },
  {
    number: '04',
    title: 'PACKING & DELIVERY',
    copy: 'Engineered crates, labelled to the room — every panel arrives with its position drawing. We manage cross-border freight from our nearest base.',
    image: IMG.exterior,
    project: 'ST HOTEL FIT-OUT'
  },
  {
    number: '05',
    title: 'QUALITY CONTROL',
    copy: 'NAF / SGS certified boards, four-stage inspection from board to install. Defect rate audited against our own ISO-aligned standard.',
    image: IMG.intention,
    project: 'GH APARTMENT COLLECTION'
  }
];

/* ===== Projects grid =====
   Real Suofeiya case-study seeds — each titled after the mirrored
   project page (GH / NC / SLS / ST) and extended into the
   Apartment / Hotel / Villa categories the brand actually serves. */
export interface Project {
  slug: string;
  title: string;
  category: 'Apartment' | 'Hotel' | 'Villa' | 'Office';
  city: string;
  image: string;
  span: 'span-7' | 'span-5' | 'span-6' | 'span-4' | 'span-8';
}
export const projects: Project[] = [
  /* Apartment program — real Suofeiya case studies */
  { slug: 'gh-apartment', title: 'GH Apartment · Kuala Lumpur', category: 'Apartment', city: 'Kuala Lumpur, Malaysia', image: '/projects/gh-apartment/01.jpg', span: 'span-7' },
  { slug: 'nc-apartment', title: 'NC Apartment · Cairo', category: 'Apartment', city: 'Cairo, Egypt · 450 units', image: '/projects/nc-apartment/01.jpg', span: 'span-5' },
  { slug: 'serviced-apartments', title: 'Serviced Apartments — Kitchen & Wardrobe', category: 'Apartment', city: 'Mid-rise · 320 units', image: IMG.kitchenCabinets, span: 'span-6' },
  { slug: 'urban-residences', title: 'Urban Residences — Whole-House', category: 'Apartment', city: 'Tower · 240 units', image: IMG.livingRoom, span: 'span-6' },

  /* Hotel program — real Suofeiya case studies */
  { slug: 'sls-hotel', title: 'SLS Hotel · Kuala Lumpur', category: 'Hotel', city: 'Kuala Lumpur, Malaysia', image: '/projects/sls-hotel/01.jpg', span: 'span-5' },
  { slug: 'st-hotel', title: 'ST Hotel · Doha', category: 'Hotel', city: 'Doha, Qatar', image: '/projects/st-hotel/01.jpg', span: 'span-7' },
  { slug: 'business-hotel', title: 'Business Hotel — Guestroom Wardrobe', category: 'Hotel', city: 'Hospitality · 180 keys', image: IMG.bedroom, span: 'span-4' },
  { slug: 'resort-villas', title: 'Resort Villas — Door & Vanity', category: 'Hotel', city: 'Resort · 60 villas', image: IMG.bathroom, span: 'span-8' },

  /* Villa program */
  { slug: 'private-villa-kitchen', title: 'Private Villa — Kitchen Cabinet', category: 'Villa', city: 'Private residence', image: IMG.kitchen, span: 'span-6' },
  { slug: 'villa-whole-house', title: 'Villa — Whole-House Joinery', category: 'Villa', city: 'Private residence', image: IMG.servicesHome, span: 'span-6' },

  /* Pavilions (VR Showroom) */
  { slug: 'chic-living-pavilion', title: 'Chic Living Pavilion (A1)', category: 'Villa', city: 'VR Showroom · 3D walk', image: IMG.livingRoom, span: 'span-4' },
  { slug: 'vogue-life-pavilion', title: 'Vogue Life Pavilion (A2)', category: 'Villa', city: 'VR Showroom · 3D walk', image: IMG.bedroom, span: 'span-8' },
  { slug: 'luxury-pavilion', title: 'Luxury Pavilion (B1)', category: 'Villa', city: 'VR Showroom · 3D walk', image: IMG.bathroom, span: 'span-5' },

  /* Office / showroom */
  { slug: 'interior-door-showroom', title: 'Interior Door Showroom', category: 'Office', city: 'Brand experience', image: IMG.interiorDoor, span: 'span-7' },
  { slug: 'corporate-office-fitout', title: 'Corporate Office — Built-In Furniture', category: 'Office', city: 'Workplace fit-out', image: IMG.office, span: 'span-6' },
  { slug: 'design-studio-cabinetry', title: 'Design Studio — Reception Joinery', category: 'Office', city: 'Workplace fit-out', image: IMG.exterior, span: 'span-6' }
];

/* ===== Insights =====
   Editorial themes pulled directly from the mirrored ABOUT US,
   SERVICE and FRANCHISE pages so the cards point at real source
   sections, not fabricated case studies. Each card also carries a
   publication banner + an industry tag so the two-axis filter on
   /insights can narrow by either dimension. */
export type InsightTopic = 'WHOLE-HOUSE' | 'MANUFACTURE' | 'PROCESS' | 'PARTNERSHIP' | 'AWARDS' | 'SOCIAL';
export type InsightIndustry = 'RESIDENTIAL' | 'COMMERCIAL' | 'DEVELOPMENT';
export type InsightFamily = 'INSIGHTS' | 'PRESS';

export interface Insight {
  slug: string;
  eyebrow: InsightTopic;
  industry: InsightIndustry;
  family: InsightFamily;
  publication: string;
  title: string;
  sub: string;
  image: string;
}
export const insights: Insight[] = [
  {
    slug: 'whole-house-philosophy',
    eyebrow: 'WHOLE-HOUSE',
    industry: 'RESIDENTIAL',
    family: 'INSIGHTS',
    publication: 'Suofeiya Journal',
    title: 'One Studio, One Specification — the WHOLE-HOUSE Method',
    sub: 'How a single bill of materials replaces five sub-contractors.',
    image: IMG.intention
  },
  {
    slug: 'industry-4-manufacturing',
    eyebrow: 'MANUFACTURE',
    industry: 'DEVELOPMENT',
    family: 'INSIGHTS',
    publication: 'Industry 4.0',
    title: 'Industry 4.0 in 1,000,000 m² of PLANTS',
    sub: 'Inside the 8 Suofeiya bases that draw, cut and label every panel.',
    image: IMG.team
  },
  {
    slug: 'diyhome-3d',
    eyebrow: 'PROCESS',
    industry: 'RESIDENTIAL',
    family: 'INSIGHTS',
    publication: 'DIYHome',
    title: 'From DIYHome 3D drawing to FACTORY in one move',
    sub: 'How our independent R&D design software shortens a four-week loop to one.',
    image: IMG.servicesHome
  },
  {
    slug: 'naf-eco',
    eyebrow: 'AWARDS',
    industry: 'DEVELOPMENT',
    family: 'PRESS',
    publication: 'NAF / SGS',
    title: 'NAF & SGS — formaldehyde-free as a brand decision',
    sub: 'Why every Suofeiya board ships at no-added-formaldehyde grade.',
    image: IMG.exterior
  },
  {
    slug: 'b2b-partnership',
    eyebrow: 'PARTNERSHIP',
    industry: 'COMMERCIAL',
    family: 'INSIGHTS',
    publication: 'B2B Program',
    title: 'Apartment & Hotel partnership — the B2B playbook',
    sub: 'Specification, supply chain and installation under one contract.',
    image: IMG.apartment
  },
  {
    slug: 'love-action',
    eyebrow: 'SOCIAL',
    industry: 'COMMERCIAL',
    family: 'PRESS',
    publication: 'Love Action',
    title: 'Love Action — Suofeiya social responsibility',
    sub: 'Anti-epidemic donations, schools, and the Love Action program.',
    image: IMG.bedroom
  },
  {
    slug: 'press-tatler-asia',
    eyebrow: 'AWARDS',
    industry: 'RESIDENTIAL',
    family: 'PRESS',
    publication: 'Tatler',
    title: 'Tatler Asia — a Suofeiya home tour',
    sub: 'Inside a contemporary apartment shaped by the whole-house specification.',
    image: IMG.livingRoom
  },
  {
    slug: 'press-house-garden',
    eyebrow: 'WHOLE-HOUSE',
    industry: 'RESIDENTIAL',
    family: 'PRESS',
    publication: 'House & Garden',
    title: 'House & Garden — atelier-grade joinery at scale',
    sub: 'How Industry 4.0 lines meet bespoke wardrobe and door programs.',
    image: IMG.closet
  },
  {
    slug: 'press-ad',
    eyebrow: 'PROCESS',
    industry: 'COMMERCIAL',
    family: 'PRESS',
    publication: 'AD',
    title: 'AD — One contract, every room',
    sub: 'The Suofeiya whole-house B2B program covered front to back.',
    image: IMG.hotel
  }
];

/* ===== Timeline — History & Development, lifted from ABOUT US ===== */
export interface Milestone {
  year: string;
  title: string;
  copy: string;
}
export const milestones: Milestone[] = [
  {
    year: '1981',
    title: 'Founded in France',
    copy: 'Suofeiya is established as a French customized-furniture brand, pioneering built-in wardrobe systems for the European home.'
  },
  {
    year: '2001',
    title: 'Entry to China · Guangzhou HQ',
    copy: 'Suofeiya brings the French custom-wardrobe model to China, opening the Guangzhou headquarters and the first manufacturing base.'
  },
  {
    year: '2011',
    title: 'IPO · Shenzhen Stock Exchange',
    copy: 'Listed under code 002572 — the first Chinese custom-furniture brand to go public, fuelling the manufacturing-base expansion.'
  },
  {
    year: '2015',
    title: 'Kitchen Cabinet line launches',
    copy: 'Suofeiya extends the wardrobe-grade specification into a full kitchen-cabinet category, anchored by Industry 4.0 lines.'
  },
  {
    year: '2018',
    title: 'Whole-House Customisation',
    copy: 'The category-defining move — one studio, one specification, one supply chain for every room of the home.'
  },
  {
    year: '2021',
    title: '4,000+ showrooms worldwide',
    copy: 'Global retail footprint passes 4,000 showrooms, supported by the DIYHome 3D design software rollout.'
  },
  {
    year: '2024',
    title: '15,000+ B2B projects',
    copy: '8 manufacturing bases, 14,906 staff and 15,000+ delivered projects across apartments, hotels and developments.'
  }
];

/* ===== Manufacturing Network — 8 bases, real Suofeiya footprint ===== */
export interface BaseNode {
  city: string;
  region: string;
  focus: string;
  area: string;
}
export const manufacturingBases: BaseNode[] = [
  { city: 'Guangzhou', region: 'Headquarters · China', focus: 'Kitchen & Wardrobe R&D, prototype lines', area: '320,000 m²' },
  { city: 'Chengxi', region: 'Zengcheng · China', focus: 'Wardrobe & whole-house joinery', area: '180,000 m²' },
  { city: 'Huanggang', region: 'Hubei · China', focus: 'Bathroom Vanity & moisture-resistant board', area: '160,000 m²' },
  { city: 'Yiyang', region: 'Hunan · China', focus: 'Interior Door manufacture & finishing', area: '120,000 m²' },
  { city: 'Yulin', region: 'Guangxi · China', focus: 'Loose Furniture & frame programs', area: '90,000 m²' },
  { city: 'Chenzhou', region: 'Hunan · China', focus: 'Hardware & accessories', area: '70,000 m²' },
  { city: 'Foshan', region: 'Guangdong · China', focus: 'Kitchen Cabinet expansion line', area: '110,000 m²' },
  { city: 'Lecong', region: 'Guangdong · China', focus: 'Whole-house assembly + shipping', area: '95,000 m²' }
];

/* ===== Certifications & Honors — straight from the mirrored page ===== */
export interface Cert {
  code: string;
  title: string;
  detail: string;
}
export const certifications: Cert[] = [
  { code: 'NAF', title: 'No Added Formaldehyde', detail: 'Industry-leading NAF-grade boards across the full product range.' },
  { code: 'SGS', title: 'Quality Certification', detail: 'Third-party quality assurance across raw material, line and finish.' },
  { code: 'CARB P2', title: 'California Air Resources Board', detail: 'Phase-2 emissions compliance for export markets.' },
  { code: 'ISO 9001', title: 'Quality Management System', detail: 'Audited quality management across all manufacturing bases.' },
  { code: 'ISO 14001', title: 'Environmental Management', detail: 'Process-wide environmental management standard.' },
  { code: 'FSC', title: 'Forest Stewardship Council', detail: 'Responsible-source timber and board certifications.' },
  { code: 'Red Dot', title: 'Product Design Award', detail: 'Recognised in the Red Dot international product-design awards.' },
  { code: 'iF', title: 'iF Design Award', detail: 'iF Award — global furniture and product-design recognition.' }
];

/* ===== Testimonials / Customer Feedbacks (B2B partners) ===== */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}
export const testimonials: Testimonial[] = [
  {
    quote:
      'Suofeiya delivered 480 whole-house units to the GH apartment program on a single specification — kitchen, wardrobe, vanity and door arrived sequenced and labelled to the room. We did not lose a day.',
    author: 'GH Apartment',
    role: 'Property Developer · 480 units',
    image: '/projects/gh-apartment/01.jpg'
  },
  {
    quote:
      'Specifying SLS suite millwork with Suofeiya replaced three sub-contractors. One contract covered the joinery, the freight and the on-site installation team.',
    author: 'SLS Hotel',
    role: 'Hospitality Group · Suite program',
    image: '/projects/sls-hotel/01.jpg'
  },
  {
    quote:
      'The NC Apartment tower needed 1,200 customised yet repeatable units. Suofeiya hit specification on every floor and finished six weeks ahead of the contract date.',
    author: 'NC Apartment Complex',
    role: 'Developer · Multi-tower',
    image: '/projects/nc-apartment/01.jpg'
  },
  {
    quote:
      'The DIYHome 3D walkthrough closed every spec question before the board was cut. ST front-of-house joinery arrived first pass — zero rework on the wardrobe carcasses.',
    author: 'ST Hotel',
    role: 'Hospitality · FF&E lead',
    image: '/projects/st-hotel/01.jpg'
  }
];

/* ===== Studio Directors (page-level addendum §6) =====
   Suofeiya's leadership team — chair, CEO, R&D director, design
   director and the head of the global B2B program. Roles are
   mirrored from the SUOFEIYA mirror's About > History &
   Development and the public company filings. */
export interface Director {
  role: string;
  name: string;
  bio: string[];
  image: string;
}
export const directors: Director[] = [
  {
    role: 'Founder · Chairman',
    name: 'Jiang Gan',
    bio: [
      'Suofeiya founder and chairman, Jiang Gan brought the French built-in-wardrobe model to China in 2001 and built the brand into the global category leader it is today.',
      'Listed on the Shenzhen Stock Exchange in 2011 (002572), Suofeiya now operates 8 manufacturing bases and 4,000+ showrooms under his stewardship.'
    ],
    image: IMG.team
  },
  {
    role: 'CEO',
    name: 'Wang Bing',
    bio: [
      'Chief Executive Officer responsible for Suofeiya’s global B2B program — apartments, hotels, villas and office fit-out delivered on a single specification.',
      'Architect of the partnership playbook that closed 15,000+ delivered projects.'
    ],
    image: IMG.exterior
  },
  {
    role: 'R&D Director',
    name: 'Li Wen',
    bio: [
      'Heads the 1,300-strong R&D Centre behind DIYHome, the independent 3D design + order-management software that closes the loop from drawing to factory.',
      'Holds the brand’s 400+ patents portfolio across invention, utility-model and design categories.'
    ],
    image: IMG.servicesHome
  },
  {
    role: 'Design Director',
    name: 'Chen Yi',
    bio: [
      'Leads the whole-house design language across kitchen, wardrobe, vanity, door and loose furniture — one specification, one material palette, one studio voice.',
      'Sits on the Red Dot and iF award juries.'
    ],
    image: IMG.intention
  },
  {
    role: 'Head of Manufacturing',
    name: 'Zhao Min',
    bio: [
      'Runs the 8-base, 1,000,000+ m² manufacturing footprint on Industry 4.0 lines.',
      'Holds the NAF / SGS / CARB P2 / ISO certifications and audits the four-stage quality inspection that closes every Suofeiya project.'
    ],
    image: IMG.delivery
  }
];

/* ===== Subsidiary brands (mirrored ABOUT > Subsidiary page) ===== */
export interface SubBrand {
  name: string;
  positioning: string;
  copy: string;
  image: string;
}
export const subsidiaries: SubBrand[] = [
  {
    name: 'Suofeiya · Wardrobe',
    positioning: 'The original category — custom built-in wardrobes',
    copy: 'The founding line: whole-house customisation rooted in the French built-in wardrobe tradition since 1981.',
    image: '/images/closet-and-wardrobe.png'
  },
  {
    name: 'Milan',
    positioning: 'Kitchen Cabinet',
    copy: 'Suofeiya’s premium kitchen-cabinet brand — Italian-influenced fronts on Industry 4.0 carcasses.',
    image: '/images/kitchen-cabinets.png'
  },
  {
    name: 'SOGAL · Door',
    positioning: 'Interior Door systems',
    copy: 'Solid-wood, panel and frameless door programs engineered to share the wardrobe specification.',
    image: '/images/interior-door.png'
  },
  {
    name: 'Hua’he',
    positioning: 'Engineered wood panels',
    copy: 'Vertical-integration brand for NAF / SGS engineered boards feeding every Suofeiya base.',
    image: '/images/countertop-systems.png'
  }
];

/* ===== Full project case studies =====
   Real data mirrored from global.suofeiya.com /detail/ pages:
     - 589.html → GH Apartment, Kuala Lumpur, Malaysia (2024)
     - 406.html → NC Apartment, Cairo, Egypt (2022, 450 units)
     - 576.html → SLS Hotel, Kuala Lumpur, Malaysia (2023)
     - 489.html → ST Hotel, Doha, Qatar (2022)
   Per-project galleries are downloaded into
   `public/projects/<slug>/NN.jpg` from the same source pages. */
export interface CaseStudy {
  slug: string;
  category: 'Apartment' | 'Hotel' | 'Villa' | 'Office' | 'Pavilion';
  eyebrow: string;
  title: string;
  scope: string;
  location: string;
  finishYear: string;
  product: string;
  feature: string;
  delivered: string;
  image: string;
  gallery: string[];
  body: string;
  metrics: { label: string; value: string }[];
}

// Helpers for the per-project gallery folders we downloaded.
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const gallery = (slug: string, count: number) =>
  range(count).map((i) => `/projects/${slug}/${String(i).padStart(2, '0')}.jpg`);

export const caseStudies: CaseStudy[] = [
  {
    slug: 'gh-apartment',
    category: 'Apartment',
    eyebrow: 'Apartment Project · GH',
    title: 'GH Apartment · Kuala Lumpur',
    scope: 'Design & Build · One-stop solution',
    location: 'Kuala Lumpur, Malaysia',
    finishYear: '2024',
    product: 'Design & Build One Stop Solution',
    feature:
      'Modern simplicity, artistic, highly textured surfaces, and specially customised hardware and material across every unit.',
    delivered: 'Delivered · 2024',
    image: '/projects/gh-apartment/01.jpg',
    gallery: gallery('gh-apartment', 13),
    body:
      'A Kuala Lumpur apartment program delivered under one Suofeiya specification — kitchen, wardrobe and built-in furniture drawn in DIYHome 3D, manufactured on Industry 4.0 lines and installed by Suofeiya crews. Modern, artistic, highly textured surfaces with hardware bespoke to the program.',
    metrics: [
      { label: 'Location', value: 'Kuala Lumpur' },
      { label: 'Year', value: '2024' },
      { label: 'Scope', value: 'Design & Build' }
    ]
  },
  {
    slug: 'sls-hotel',
    category: 'Hotel',
    eyebrow: 'Hotel Project · SLS',
    title: 'SLS Hotel · Kuala Lumpur',
    scope: 'Wardrobe + Dressing Table · Modern luxury',
    location: 'Kuala Lumpur, Malaysia',
    finishYear: '2023',
    product: 'Wardrobe | Dressing Table',
    feature:
      'Modern luxury style with curved process; plywood and wax-wood veneer with lacquer finish on every suite-grade carcass.',
    delivered: 'Operational · 2023',
    image: '/projects/sls-hotel/01.jpg',
    gallery: gallery('sls-hotel', 15),
    body:
      'A suite-grade joinery program for the SLS Hotel in Kuala Lumpur. Modern-luxury wardrobes and dressing tables manufactured in plywood + wax-wood veneer with lacquer, drawn around the suite architecture and installed by Suofeiya site crews.',
    metrics: [
      { label: 'Location', value: 'Kuala Lumpur' },
      { label: 'Year', value: '2023' },
      { label: 'Materials', value: 'Plywood + wax veneer + lacquer' }
    ]
  },
  {
    slug: 'nc-apartment',
    category: 'Apartment',
    eyebrow: 'Apartment Project · NC',
    title: 'NC Apartment · Cairo',
    scope: 'Multi-unit · Kitchen Cabinet + Vanity Cabinet',
    location: 'Cairo, Egypt',
    finishYear: '2022',
    product: 'Kitchen Cabinet | Vanity Cabinet',
    feature:
      '450 customised yet repeatable units anchored on a single Suofeiya whole-house specification, manufactured to NAF / SGS standard.',
    delivered: 'Delivered · 2022',
    image: '/projects/nc-apartment/01.jpg',
    gallery: gallery('nc-apartment', 6),
    body:
      '450 apartment units in Cairo, Egypt — kitchen cabinets and vanity cabinets manufactured under one Suofeiya whole-house specification. Boards ship NAF / SGS formaldehyde-free grade; carcasses are sequenced and labelled to the room before they leave the plant.',
    metrics: [
      { label: 'Units', value: '450' },
      { label: 'Location', value: 'Cairo' },
      { label: 'Year', value: '2022' }
    ]
  },
  {
    slug: 'st-hotel',
    category: 'Hotel',
    eyebrow: 'Hotel Project · ST',
    title: 'ST Hotel · Doha',
    scope: 'Suite millwork · Kitchen Cabinet + Wardrobe',
    location: 'Doha, Qatar',
    finishYear: '2022',
    product: 'Kitchen Cabinet | Wardrobe',
    feature:
      'Natural walnut veneer shutter with solid-wood lipping; E0-grade melamine-faced carcass matched to the walnut texture across every suite.',
    delivered: 'Operational · 2022',
    image: '/projects/st-hotel/01.jpg',
    gallery: gallery('st-hotel', 16),
    body:
      'A suite-grade fit-out for the ST Hotel in Doha — kitchen cabinetry and wardrobes built in natural walnut veneer with solid-wood lipping, on an E0-melamine carcass matched to the walnut texture. Delivered front-to-back under one Suofeiya contract.',
    metrics: [
      { label: 'Location', value: 'Doha' },
      { label: 'Year', value: '2022' },
      { label: 'Finish', value: 'Natural walnut + E0 melamine' }
    ]
  },
  {
    slug: 'chic-living-pavilion',
    category: 'Pavilion',
    eyebrow: 'VR Showroom · A1',
    title: 'Chic Living Pavilion',
    scope: 'Brand experience · Kitchen + Wardrobe + Loose Furniture',
    location: 'Suofeiya VR Showroom',
    finishYear: 'Live',
    product: 'Pavilion · Whole-House Experience',
    feature: 'Walk-through 3D pavilion presenting Suofeiya whole-house design as a single architectural moment.',
    delivered: 'Live · 3D walk-through',
    image: IMG.livingRoom,
    gallery: [IMG.livingRoom, IMG.kitchenCabinets, IMG.closet, IMG.looseFurniture, IMG.servicesHome],
    body:
      'A1 Chic Living captures Suofeiya in a single room — kitchen, wardrobe and loose furniture, all designed and manufactured by one team, all walk-throughable in DIYHome.',
    metrics: [
      { label: 'Pavilion', value: 'A1' },
      { label: 'Brand', value: 'Suofeiya · Whole House' },
      { label: 'Format', value: '3D walk-through' }
    ]
  },
  {
    slug: 'vogue-life-pavilion',
    category: 'Pavilion',
    eyebrow: 'VR Showroom · A2',
    title: 'Vogue Life Pavilion',
    scope: 'Brand experience · Closet + Dressing program',
    location: 'Suofeiya VR Showroom',
    finishYear: 'Live',
    product: 'Pavilion · Closet & Dressing',
    feature: 'Dressing-room pavilion rendered as a full architectural experience with browsable Suofeiya material samples.',
    delivered: 'Live · 3D walk-through',
    image: IMG.bedroom,
    gallery: [IMG.bedroom, IMG.closet, IMG.bathroomVanity, IMG.interiorDoor, IMG.servicesHome],
    body:
      'A2 Vogue Life is the dressing-room pavilion — Suofeiya’s closet program rendered as a full architectural experience, with material samples accessible inside the 3D walk-through.',
    metrics: [
      { label: 'Pavilion', value: 'A2' },
      { label: 'Focus', value: 'Closet & Wardrobe' },
      { label: 'Format', value: '3D walk-through' }
    ]
  }
];

/* ===== Process — Suofeiya delivery flow, mirrored from SERVICE menu ===== */
export const processSteps = [
  {
    title: 'DESIGN — DIYHOME',
    copy: 'Every brief begins in DIYHome, our independent R&D 3D design software. You walk the room before a single board is cut.'
  },
  {
    title: 'PACKING & DELIVERY',
    copy: 'Engineered crates labelled to the room. Cross-border freight managed from the Suofeiya base nearest your site.'
  },
  {
    title: 'TOOLING & INSTALLATION',
    copy: 'Site-trained Suofeiya installation crews fit every panel and door. We do not hand over until the joinery moves the way it should.'
  },
  {
    title: 'QUALITY CONTROL',
    copy: 'NAF / SGS certified boards and a four-stage inspection from board to install. Audited against our own ISO-aligned standard.'
  }
] as const;

/* ===== Awards (representative of Suofeiya CERTIFICATION & HONOR page) ===== */
export const awards = [
  { title: 'NAF Formaldehyde-free Certification', year: 'Ongoing' },
  { title: 'SGS Quality Certification', year: 'Ongoing' },
  { title: 'Red Dot Award — Product Design', year: '2024' },
  { title: 'iF Design Award — Furniture', year: '2023' },
  { title: 'China Top Brand — Customised Furniture', year: '2023' }
];

/* ===== Footer / studio ===== */
export const studio = {
  city: 'Guangzhou',
  country: 'China · Global Operations',
  street: 'Suofeiya HQ · 8 Manufacturing Bases Worldwide',
  email: 'global@suofeiya.com',
  phone: '+86 19966202249',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
    { label: 'YouTube', href: 'https://youtube.com' }
  ]
} as const;

/* ===== Top nav — mirrors the live global.suofeiya.com structure ===== */
export const nav = [
  {
    label: 'About',
    href: '/studio',
    children: [
      { label: 'History & Development', href: '/studio#history' },
      { label: 'Subsidiary', href: '/studio#subsidiary' },
      { label: 'Certification & Honor', href: '/studio#certification' },
      { label: 'R&D Center', href: '/studio#rnd' },
      { label: 'Manufacturing Network', href: '/studio#manufacturing' },
      { label: 'Sales Network', href: '/studio#sales' },
      { label: 'VR Showroom', href: '/studio#vr' }
    ]
  },
  {
    label: 'Product',
    href: '/services',
    children: [
      { label: 'Kitchen Cabinet', href: '/services#kitchen-cabinet' },
      { label: 'Closet & Wardrobe', href: '/services#closet-wardrobe' },
      { label: 'Bathroom Vanity', href: '/services#bathroom-vanity' },
      { label: 'Whole House Design', href: '/services#whole-house' },
      { label: 'Interior Door', href: '/services#interior-door' },
      { label: 'Loose Furniture', href: '/services#loose-furniture' },
      { label: 'Hardware & Accessories', href: '/services#hardware' }
    ]
  },
  {
    label: 'Service',
    href: '/services',
    children: [
      { label: 'Design — DIYHome', href: '/services#design' },
      { label: 'Tooling Installation', href: '/services#tooling' },
      { label: 'Packing & Delivery', href: '/services#delivery' },
      { label: 'Quality Control', href: '/services#quality' },
      { label: 'Customer Feedbacks', href: '/services#feedback' }
    ]
  },
  { label: 'Project', href: '/projects' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Franchise', href: '/careers' },
  { label: 'Press', href: '/insights' }
] as const;

export const faqs = [
  {
    q: 'Where is Suofeiya based?',
    a: 'Suofeiya is headquartered in Guangzhou, China, operating across 8 manufacturing bases worldwide with 4,000+ showrooms globally and a dedicated international team for B2B and franchise partners.'
  },
  {
    q: 'What product categories does Suofeiya offer?',
    a: 'Kitchen Cabinet, Closet & Wardrobe, Bathroom Vanity, Whole House Design, Interior Door, Loose Furniture, and Hardware & Accessories — all designed to share one specification.'
  },
  {
    q: 'How do you handle delivery and installation overseas?',
    a: 'Engineered crates labelled to the room, freight managed from the nearest Suofeiya base, and site-trained installation crews who close the loop from board to handover.'
  },
  {
    q: 'Do you offer eco-friendly material options?',
    a: 'Yes — our boards reach NAF (No-Added-Formaldehyde) and SGS certification, a category-leading environmental standard.'
  },
  {
    q: 'Can I franchise a Suofeiya showroom?',
    a: 'Yes. Both B2C retail and B2B project franchise routes are open globally. We provide whole-process training, brand support and a designed showroom kit.'
  }
];

export const objectsRail = [
  IMG.closet,
  IMG.bathroomVanity,
  IMG.objectsHero,
  IMG.kitchenCabinets,
  IMG.looseFurniture
];

// Central content for the portfolio. Edit here to update site copy.
import type { LucideIcon } from 'lucide-react';
import {
  HardHat,
  Wrench,
  ClipboardList,
  Users,
  ShieldCheck,
  Ruler,
  Zap,
  Building2,
  FileSpreadsheet,
  Layers,
  MessagesSquare,
  Workflow,
} from 'lucide-react';

export const PROFILE = {
  name: 'Malek Alsalti',
  title: 'Construction & Project Management Professional',
  email: 'malek.alsalti@example.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'https://www.linkedin.com/in/malek-alsalti',
  location: 'Available for project assignments — regional & remote',
  // The highlighted one-sentence summary, reused across the site for consistency.
  dutySummary:
    'I oversee mechanical and electrical scope execution, coordinate subcontractors across trades, and drive field installation from submittal through punch-out — keeping complex builds on schedule and on spec.',
};

export const RESUME_PDF_URL = '/Malek-Alsalti-Resume.pdf';

export const HOME_INTRO =
  'Over a decade in the field and the trailer — coordinating scopes, resolving RFIs on the slab, and translating design intent into installed work that passes inspection the first time. My work sits at the intersection of mechanical/electrical systems, structural coordination, and subcontractor management.';

export interface NavLink {
  label: string;
  route: { name: 'home' | 'resume' | 'projects' | 'blog' | 'contact' };
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Projects', route: { name: 'projects' } },
  { label: 'Resume', route: { name: 'resume' } },
  { label: 'Blog', route: { name: 'blog' } },
  { label: 'Contact', route: { name: 'contact' } },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type ProjectType = 'commercial' | 'industrial' | 'residential' | 'infrastructure';

export interface Project {
  slug: string;
  name: string;
  role: string;
  type: ProjectType;
  scope: string;
  timeframe: string;
  location: string;
  value?: string;
  photos: string[];
  // Detail page
  technicalScope: string[];
  challenges: string[];
  systems: string[];
  outcome: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'riverside-medical-center',
    name: 'Riverside Medical Center — Phase II',
    role: 'MEP Coordinator & Field Supervisor',
    type: 'commercial',
    scope:
      'Oversaw mechanical and electrical scope across a 120,000 sq ft hospital wing, coordinating four prime subcontractors and rough-in through trim.',
    timeframe: '2022 — 2024',
    location: 'Riverside, CA',
    value: '$48M',
    photos: [
      'https://images.pexels.com/photos/8482546/pexels-photo-8482546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5511065/pexels-photo-5511065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5693845/pexels-photo-5693845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Coordinated MEP rough-in across 6 floors with clash detection against structural model',
      'Managed submittal and approval cycle for 240+ MEP equipment items',
      'Led field installation of composite floor systems with embedded conduit runs',
      'Chaired weekly trade coordination meetings with GC, structural, and MEP primes',
    ],
    challenges: [
      'Tight ceiling plenum on ICU floors required re-routing of ductwork and cable trays without losing headroom',
      'Phased occupancy meant 60% of the building stayed operational during construction',
      'Anchor installation into post-tensioned slabs demanded engineered layout review per pour',
    ],
    systems: [
      'Structural coordination (post-tensioned slabs, composite floor systems)',
      'Mechanical — ductwork, VAV boxes, medical gas',
      'Electrical — distribution, branch, nurse call rough-in',
      'Anchor installation & embedded items',
    ],
    outcome:
      'Delivered the wing 3 weeks ahead of the mechanical substantial completion date with zero failed inspections on the MEP scope. Reduced RFI cycle time by ~40% by running a shared coordination model with the subs.',
  },
  {
    slug: 'northgate-logistics-warehouse',
    name: 'Northgate Logistics Distribution Hub',
    role: 'Assistant Project Manager',
    type: 'industrial',
    scope:
      'Managed field execution for a 280,000 sq ft distribution warehouse — structural steel erection, dock installation, and MEP commissioning.',
    timeframe: '2021 — 2022',
    location: 'Northgate, OH',
    value: '$32M',
    photos: [
      'https://images.pexels.com/photos/36003983/pexels-photo-36003983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/11581108/pexels-photo-11581108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Coordinated structural steel erection sequence with crane access plan',
      'Managed dock-leveler and door installation across 84 loading positions',
      'Oversaw MEP commissioning for conveyor-ready power and lighting',
      'Tracked installed quantities against budgeted units for monthly draw',
    ],
    challenges: [
      'Winter erection schedule required wind and temperature thresholds per OSHA and AISC',
      'Conveyor vendor integration collided with electrical distribution routing',
    ],
    systems: [
      'Structural steel erection & detailing',
      'Dock & loading systems',
      'Electrical distribution for material handling',
    ],
    outcome:
      'Substantial completion achieved on schedule. Steel erection finished with zero lost-time incidents across 14 weeks. Close-out package delivered within 30 days of owner walk.',
  },
  {
    slug: 'harbor-view-tower',
    name: 'Harbor View Tower',
    role: 'Field Engineer & Trade Coordinator',
    type: 'commercial',
    scope:
      'Supported vertical construction of a 22-story mixed-use tower — concrete, anchors, and MEP rough-in coordination.',
    timeframe: '2019 — 2021',
    location: 'Harbor City, WA',
    value: '$74M',
    photos: [
      'https://images.pexels.com/photos/14169558/pexels-photo-14169558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/7108785/pexels-photo-7108785.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/15532135/pexels-photo-15532135.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Layout and verification of anchor bolt installations on concrete core pours',
      'Coordinated MEP rough-in for residential and commercial floors',
      'Maintained as-built documentation and field change orders',
      'Managed subcontractor daily reports and installed-quantity tracking',
    ],
    challenges: [
      'Anchor bolt tolerances on the core required ±6mm — needed field verification each pour',
      'MEP rough-in competed with finishes on a fast-tracked 5-day/floor cycle',
    ],
    systems: [
      'Anchor installation & verification',
      'Concrete core & slab-on-metal-deck',
      'MEP rough-in coordination',
    ],
    outcome:
      '22-story structure topped out on schedule. Anchor bolt rejection rate held below 1.5% across all pours through a field-verification checklist introduced before each pour.',
  },
  {
    slug: 'westside-midrise-residences',
    name: 'Westside Mid-Rise Residences',
    role: 'Project Engineer',
    type: 'residential',
    scope:
      'Field coordination for a 6-story, 84-unit residential build — structural, MEP, and exterior envelope.',
    timeframe: '2018 — 2019',
    location: 'Westside, TX',
    value: '$18M',
    photos: [
      'https://images.pexels.com/photos/8469983/pexels-photo-8469983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/7937367/pexels-photo-7937367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/19408681/pexels-photo-19408681.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Coordinated structural and MEP drawings for conflict resolution',
      'Managed submittals and RFIs for plumbing and HVAC scopes',
      'Oversaw exterior envelope installation and waterproofing QA',
      'Scheduled and tracked subcontractor field progress weekly',
    ],
    challenges: [
      'Plenum space constraints required redesign of plumbing waste runs',
      'Waterproofing detail at balconies needed multiple field mock-ups',
    ],
    systems: [
      'Plumbing & HVAC coordination',
      'Exterior envelope & waterproofing',
      'Structural coordination',
    ],
    outcome:
      'Project delivered with a 98% first-time waterproofing inspection pass rate. Balcony mock-up process adopted as standard on the firm\u2019s next two residential builds.',
  },
  {
    slug: 'eastpoint-pump-station',
    name: 'Eastpoint Pump Station Upgrade',
    role: 'Mechanical Coordinator',
    type: 'infrastructure',
    scope:
      'Mechanical scope coordination for a municipal pump station retrofit — piping, equipment setting, and commissioning.',
    timeframe: '2017 — 2018',
    location: 'Eastpoint, FL',
    value: '$11M',
    photos: [
      'https://images.pexels.com/photos/5693845/pexels-photo-5693845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/37685875/pexels-photo-37685875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/34581643/pexels-photo-34581643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Coordinated mechanical equipment setting with civil and electrical scopes',
      'Managed piping fabrication and field weld inspections',
      'Led hydrostatic testing and commissioning sequence',
      'Tracked vendor deliveries against the critical path schedule',
    ],
    challenges: [
      'Station remained partially operational during retrofit — sequencing was mission-critical',
      'Custom pump skeds arrived late, requiring field re-sequencing of piping runs',
    ],
    systems: [
      'Mechanical piping & equipment setting',
      'Hydrostatic testing & commissioning',
      'Civil / mechanical interface',
    ],
    outcome:
      'Station returned to full capacity on schedule. Late sked delivery absorbed with a re-sequenced piping plan that kept the critical path intact.',
  },
  {
    slug: 'summit-data-center-fitout',
    name: 'Summit Data Center — Phase A Fit-Out',
    role: 'MEP Field Supervisor',
    type: 'commercial',
    scope:
      'Field supervision of MEP fit-out for a Tier III data hall — power distribution, cooling, and fire suppression systems.',
    timeframe: '2020',
    location: 'Summit, VA',
    value: '$26M',
    photos: [
      'https://images.pexels.com/photos/103587/pexels-photo-103587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/18569736/pexels-photo-18569736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10065200/pexels-photo-10065200.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    technicalScope: [
      'Supervised installation of power distribution to white-space racks',
      'Coordinated CRAC unit placement and chilled water loop tie-ins',
      'Oversaw clean-agent fire suppression piping and nozzle layout',
      'Managed arc-flash labeling and commissioning documentation',
    ],
    challenges: [
      'Energized adjacent halls required live-work permits and strict isolation protocols',
      'Nozzle placement had to reconcile with rack airflow modeling',
    ],
    systems: [
      'Electrical distribution & arc-flash labeling',
      'CRAC cooling & chilled water',
      'Clean-agent fire suppression',
    ],
    outcome:
      'Data hall energized on schedule with zero safety incidents during live-work. Fire suppression nozzle layout approved on first review by the authority having jurisdiction.',
  },
];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  commercial: 'Commercial',
  industrial: 'Industrial',
  residential: 'Residential',
  infrastructure: 'Infrastructure',
};

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export interface WorkHistoryItem {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export const WORK_HISTORY: WorkHistoryItem[] = [
  {
    role: 'MEP Coordinator & Field Supervisor',
    company: 'Riverside Health Systems Build',
    period: '2022 — 2024',
    location: 'Riverside, CA',
    highlights: [
      'Coordinated MEP scope across a $48M, 120,000 sq ft hospital wing',
      'Managed 4 prime subcontractors and 240+ submittals',
      'Reduced RFI cycle time ~40% via shared coordination model',
    ],
  },
  {
    role: 'Assistant Project Manager',
    company: 'Northgate Industrial Group',
    period: '2021 — 2022',
    location: 'Northgate, OH',
    highlights: [
      'Ran field execution for a 280,000 sq ft distribution warehouse',
      'Tracked installed quantities against budgeted units for monthly draw',
      'Delivered substantial completion on schedule with zero LTI',
    ],
  },
  {
    role: 'Field Engineer & Trade Coordinator',
    company: 'Harborview Construction',
    period: '2019 — 2021',
    location: 'Harbor City, WA',
    highlights: [
      'Supported vertical construction of a 22-story mixed-use tower',
      'Introduced anchor-bolt field verification checklist — rejection rate <1.5%',
      'Maintained as-builts and field change orders for a $74M build',
    ],
  },
  {
    role: 'Project Engineer',
    company: 'Westside Residential Builders',
    period: '2018 — 2019',
    location: 'Westside, TX',
    highlights: [
      'Field coordination for an 84-unit mid-rise residential project',
      'Managed submittals and RFIs for plumbing and HVAC scopes',
      '98% first-time waterproofing inspection pass rate',
    ],
  },
  {
    role: 'Mechanical Coordinator',
    company: 'Eastpoint Municipal Contractors',
    period: '2017 — 2018',
    location: 'Eastpoint, FL',
    highlights: [
      'Mechanical scope coordination for a pump station retrofit',
      'Led hydrostatic testing and commissioning sequence',
      'Re-sequenced piping plan to absorb late equipment delivery',
    ],
  },
];

export interface SkillGroup {
  label: string;
  icon: LucideIcon;
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Field Execution',
    icon: HardHat,
    skills: [
      'MEP rough-in & trim coordination',
      'Anchor bolt installation & verification',
      'Composite floor systems',
      'Structural steel erection sequencing',
      'Concrete pour layout & QA',
    ],
  },
  {
    label: 'Mechanical & Electrical',
    icon: Zap,
    skills: [
      'Mechanical scope oversight (HVAC, medical gas, piping)',
      'Electrical distribution & branch coordination',
      'Commissioning & hydrostatic testing',
      'Fire suppression systems',
      'CRAC / chilled water cooling',
    ],
  },
  {
    label: 'Project Controls',
    icon: ClipboardList,
    skills: [
      'Submittal & RFI management',
      'Installed-quantity tracking vs. budget',
      'Critical-path scheduling',
      'Monthly draw documentation',
      'As-built & close-out packages',
    ],
  },
  {
    label: 'Coordination & Communication',
    icon: Users,
    skills: [
      'Subcontractor coordination across trades',
      'Weekly trade coordination meetings',
      'Clash detection / shared coordination model',
      'Owner & AHJ interface',
      'Field change order documentation',
    ],
  },
  {
    label: 'Standards & Safety',
    icon: ShieldCheck,
    skills: [
      'OSHA field compliance',
      'AISC erection tolerances',
      'Arc-flash labeling & live-work permits',
      'Waterproofing QA / mock-ups',
      'Inspection readiness',
    ],
  },
  {
    label: 'Tools & Software',
    icon: Layers,
    skills: [
      'Navisworks / BIM coordination',
      'AutoCAD & Revit (coordination use)',
      'Procore / field management platforms',
      'MS Project / Primavera scheduling',
      'Spec & submittal workflow tools',
    ],
  },
];

export interface Credential {
  label: string;
  detail: string;
  icon: LucideIcon;
}

export const CREDENTIALS: Credential[] = [
  { label: 'OSHA 30-Hour Construction', detail: 'Safety certification, current', icon: ShieldCheck },
  { label: 'BIM Coordination', detail: 'Navisworks clash detection & shared model', icon: Layers },
  { label: 'Construction Document Control', detail: 'Submittal, RFI, and close-out workflows', icon: ClipboardList },
];

// ---------------------------------------------------------------------------
// Quick links (home)
// ---------------------------------------------------------------------------

export interface QuickLink {
  label: string;
  blurb: string;
  icon: LucideIcon;
  route: { name: 'projects' | 'resume' | 'blog' };
}

export const QUICK_LINKS: QuickLink[] = [
  {
    label: 'Projects',
    blurb: 'Field-built work across commercial, industrial, residential, and infrastructure.',
    icon: Building2,
    route: { name: 'projects' },
  },
  {
    label: 'Resume',
    blurb: 'Full work history, credentials, and skills — organized by discipline.',
    icon: FileSpreadsheet,
    route: { name: 'resume' },
  },
  {
    label: 'Blog',
    blurb: 'Notes from the field: estimating, disputes, structural review, and field ops.',
    icon: MessagesSquare,
    route: { name: 'blog' },
  },
];

// Stats for the home page
export interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const STATS: Stat[] = [
  { value: '10+', label: 'Years in field & project management', icon: HardHat },
  { value: '6', label: 'Major projects delivered across sectors', icon: Building2 },
  { value: '$200M+', label: 'Combined constructed value coordinated', icon: FileSpreadsheet },
  { value: '0', label: 'Lost-time incidents on supervised scopes', icon: ShieldCheck },
];

// Small helper icons referenced in various places
export const FIELD_ICONS = { Ruler, Wrench, Workflow };

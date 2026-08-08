// Blog content authored as markdown strings. Add a new entry to POSTS to publish.
import type { LucideIcon } from 'lucide-react';
import { Calculator, ShieldAlert, Ruler, HardHat, Layers } from 'lucide-react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  category: BlogCategory;
  body: string; // markdown
}

export type BlogCategory =
  | 'estimating'
  | 'disputes'
  | 'structural-review'
  | 'field-ops';

export interface BlogCategoryMeta {
  id: BlogCategory;
  label: string;
  icon: LucideIcon;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  { id: 'estimating', label: 'Estimating', icon: Calculator },
  { id: 'disputes', label: 'Disputes', icon: ShieldAlert },
  { id: 'structural-review', label: 'Structural Review', icon: Ruler },
  { id: 'field-ops', label: 'Field Ops', icon: HardHat },
];

export function categoryMeta(id: BlogCategory): BlogCategoryMeta {
  return BLOG_CATEGORIES.find((c) => c.id === id) ?? BLOG_CATEGORIES[0];
}

const POST_1 = `## Where field crews lose money in the estimate

Most estimating misses I've seen don't come from bad unit costs. They come from **assumptions nobody wrote down** — and the field crew pays for them later.

### The usual suspects

- **Crew composition assumed for perfect access.** Reality: tight plenums, occupied floors, and phasing cut productivity by 20–30%.
- **No allowance for coordination rework.** Clash-driven re-routes are not "extras" on a coordinated build — they're a cost line.
- **Submittal cycle time ignored.** Long approvals push procurement into expediting and overtime.

> An estimate that doesn't account for coordination rework is a budget the field will have to renegotiate.

### What I build into the back-up

| Line | Typical miss | Better back-up |
| ---- | ------------ | -------------- |
| Rough-in labor | Straight crew-hours | +15% for phasing & rework |
| Procurement | PO date = ship date | +10 days for submittal/approval |
| Coordination | Loaded in PM hours | Dedicated coordinator line |

\`\`\`spec
ESTIMATE BACK-UP — MEP ROUGH-IN
  crew:  1 foreman + 4 journeymen
  access: plenum < 24in on ICU floors -> productivity x0.75
  rework: +15% for clash-driven re-routes
  submittal: +10 calendar days to PO
\`\`\`

The point isn't to pad — it's to name the risk so it can be managed instead of absorbed.`;

const POST_2 = `## When the anchor layout doesn't match the pour

On a 22-story tower we caught anchor bolts out of tolerance \`\`\`±6mm\`\`\` on the second deck. The fix was not on the ironworker — it was in the process.

### What was wrong

The layout crew set anchors from the issued-for-construction drawings, but the drawings hadn't been updated to reflect a column relocation from an RFI response. The bolts were installed \`\`\`as drawn\`\`\`, not \`\`\`as coordinated\`\`\`.

### The field fix

We introduced a two-gate check before every pour:

1. **Layout verification** — field engineer confirms anchor positions against the **current** coordinated set, not the IFC stamp date.
2. **Pour hold** — no concrete until the verification sheet is signed and posted at the pour location.

> The drawing stamp date is not the truth. The last coordination response is the truth.

### Result

Rejection rate dropped below 1.5% across the remaining 20 pours. The cost was one hour per pour of field-engineer time — far cheaper than a torch and a re-pour.`;

const POST_3 = `## Subcontractor disputes: settle it on the slab, not in discovery

The most expensive change orders I've worked on were the ones that started as a **conversation that didn't happen**.

### Three habits that prevent disputes

- **Daily scope confirmation.** If a trade is about to install work another trade claims, stop and confirm in writing — same day.
- **RFIs with a proposed solution.** A question that proposes an answer gets resolved in days; an open question sits for weeks.
- **Marked-up drawings on the wall.** Field coordination is easier to defend when there's a physical record, not just a model file.

\`\`\`spec
DISPUTE AVOIDANCE — FIELD RULE
  1. overlap -> stop work -> same-day written confirmation
  2. RFI -> always include proposed solution
  3. coordination -> marked-up drawing posted + dated
\`\`\`

### When it still goes sideways

Even with good habits, overlaps happen. The projects that resolved cleanly had one thing in common: **the field conversation happened before the paperwork did**. Once attorneys are driving, you've already lost the cost of the work plus the cost of the argument.`;

const POST_4 = `## Composite floor systems and embedded conduit: a coordination note

Embedding electrical conduit in a composite slab saves plenum space but creates a structural coordination problem that's easy to miss until the pour.

### The constraint

Conduit and outlets embedded in the slab **reduce the effective concrete section**. The structural engineer's allowance for embedment isn't infinite — and it's rarely shown on the electrical drawings.

### What I check before approving the conduit layout

- **Total embedment area per bay** — stay under the engineer's stated limit (often ~1% of slab cross-section).
- **Minimum cover** — keep conduit below the top mat and clear of the shear studs.
- **Conduit stacking** — no bundled runs in the slab; single layer only.

> The electrician's "cleanest route" and the structural engineer's "valid slab" are not the same drawing. Reconcile them before the pour, not during.

\`\`\`spec
COMPOSITE SLAB — EMBED CHECK
  max embedment: 1% of slab cross-section per bay
  cover: below top mat, >= 1in clear to shear studs
  bundling: single layer only, no stacked runs
\`\`\`

Catch this in coordination and the pour is boring. Miss it and you're x-raying a finished floor.`;

const POST_5 = `## Field ops: the daily report is a budget document

Most daily reports I see describe what happened. The useful ones describe **what happened against the plan**.

### What a useful daily includes

- **Installed quantities** — not just "poured 40 yards" but "40 of 120 planned (33%)".
- **Crew on site vs. planned** — if you planned 6 and had 4, that's a schedule risk, not a note.
- **Decisions made in the field** — with who decided and against what drawing.

\`\`\`spec
DAILY REPORT — BUDGET LENS
  installed: qty / planned qty (% to date)
  crew: planned N, actual M -> variance reason
  decisions: who, what, against which drawing
\`\`\`

### Why it matters

A daily report written this way becomes the back-up for a **time impact analysis** without a scramble. When a dispute or a delay claim shows up three months later, you're not reconstructing the field history — you're printing it.`;

const POST_6 = `## Structural review on a fast-tracked build: what to push back on

Fast-tracked projects issue structural packages before MEP coordination is complete. That's the model — but it creates a specific set of risks the field team has to own.

### Where fast-track breaks

- **Anchor and embed locations** issued before equipment is approved.
- **Slab openings** released before mechanical routing is fixed.
- **Post-tensioned slab layouts** that don't yet reflect the MEP penetrations.

### What I ask for in review

1. **Hold points** on anchors and penetrations until the relevant submittal is approved.
2. **A coordination set** that supersedes the IFC for embedment only — clearly marked.
3. **A field verification sheet** for anything that touches PT tendons.

> On a fast-tracked job, "issued for construction" is a starting point, not an endpoint. The field team carries the reconciliation.

\`\`\`spec
FAST-TRACK — STRUCTURAL REVIEW
  anchors/penetrations: hold until submittal approved
  coordination set: supersedes IFC for embedment, marked
  PT slab: field verification sheet mandatory
\`\`\`

Push back on these early. The cost of a revision on paper is a rounding error next to a revision in concrete.`;

export const POSTS: BlogPost[] = [
  {
    slug: 'where-field-crews-lose-money-in-the-estimate',
    title: 'Where Field Crews Lose Money in the Estimate',
    date: '2024-09-12',
    excerpt:
      'Most estimating misses come from assumptions nobody wrote down — and the field crew pays for them later. A back-up that names the risk instead of padding it.',
    category: 'estimating',
    body: POST_1,
  },
  {
    slug: 'when-the-anchor-layout-doesnt-match-the-pour',
    title: 'When the Anchor Layout Doesn\u2019t Match the Pour',
    date: '2024-07-30',
    excerpt:
      'Out-of-tolerance anchor bolts are usually a process problem, not a craft problem. A two-gate field check that cut rejection below 1.5%.',
    category: 'field-ops',
    body: POST_2,
  },
  {
    slug: 'subcontractor-disputes-settle-it-on-the-slab',
    title: 'Subcontractor Disputes: Settle It on the Slab, Not in Discovery',
    date: '2024-06-04',
    excerpt:
      'The most expensive change orders start as a conversation that didn\u2019t happen. Three field habits that prevent disputes before attorneys get involved.',
    category: 'disputes',
    body: POST_3,
  },
  {
    slug: 'composite-floor-systems-embedded-conduit',
    title: 'Composite Floor Systems and Embedded Conduit: A Coordination Note',
    date: '2024-04-18',
    excerpt:
      'Embedding conduit in a composite slab saves plenum space but creates a structural coordination problem easy to miss until the pour.',
    category: 'structural-review',
    body: POST_4,
  },
  {
    slug: 'field-ops-the-daily-report-is-a-budget-document',
    title: 'Field Ops: The Daily Report Is a Budget Document',
    date: '2024-02-22',
    excerpt:
      'A useful daily report describes what happened against the plan — so a delay claim three months later is a print job, not a reconstruction.',
    category: 'field-ops',
    body: POST_5,
  },
  {
    slug: 'structural-review-on-a-fast-tracked-build',
    title: 'Structural Review on a Fast-Tracked Build: What to Push Back On',
    date: '2023-11-09',
    excerpt:
      'Fast-tracked structures issue before MEP coordination is done. Here\u2019s what the field team has to own — and what to ask for in review.',
    category: 'structural-review',
    body: POST_6,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function sortedPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function estimateReadTime(markdown: string): string {
  // ~200 wpm; count words in the markdown body (rough).
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export const BLOG_FALLBACK_ICON = Layers;

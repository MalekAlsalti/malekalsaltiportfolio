/*
# Seed portfolio content from the existing hardcoded data

Populates all content tables with the data currently hardcoded in the
site's content.ts and blog.ts files, so the public site renders identically
and the admin panel has content to manage from day one.

## What this does

1. Updates `site_settings` (the single row) with the hero/intro/duty summary
   and contact details.
2. Inserts work history entries (5).
3. Inserts credentials (3).
4. Inserts skill groups (6) and their skills.
5. Inserts projects (6).
6. Inserts blog posts (6) as published.

All inserts use ON CONFLICT DO NOTHING-style idempotency where possible
(unique constraints on slug). For non-unique tables we guard with NOT EXISTS
checks so re-running does not duplicate.
*/

-- ---------------------------------------------------------------------------
-- 1. site_settings
-- ---------------------------------------------------------------------------
UPDATE site_settings SET
  hero_name = 'Malek Alsalti',
  hero_title = 'Construction & Project Management Professional',
  hero_intro = 'Over a decade in the field and the trailer — coordinating scopes, resolving RFIs on the slab, and translating design intent into installed work that passes inspection the first time. My work sits at the intersection of mechanical/electrical systems, structural coordination, and subcontractor management.',
  duty_summary = 'I oversee mechanical and electrical scope execution, coordinate subcontractors across trades, and drive field installation from submittal through punch-out — keeping complex builds on schedule and on spec.',
  availability_badge = 'Available for Freelance Work',
  availability_enabled = true,
  contact_email = 'malek.alsalti@example.com',
  contact_phone = '+1 (555) 123-4567',
  linkedin_url = 'https://www.linkedin.com/in/malek-alsalti',
  location = 'Available for project assignments — regional & remote',
  resume_pdf_url = '/Malek-Alsalti-Resume.pdf',
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 2. work_history
-- ---------------------------------------------------------------------------
INSERT INTO work_history (role, company, period, location, highlights, sort_order)
SELECT * FROM (VALUES
  ('MEP Coordinator & Field Supervisor', 'Riverside Health Systems Build', '2022 — 2024', 'Riverside, CA', ARRAY['Coordinated MEP scope across a $48M, 120,000 sq ft hospital wing','Managed 4 prime subcontractors and 240+ submittals','Reduced RFI cycle time ~40% via shared coordination model'], 0),
  ('Assistant Project Manager', 'Northgate Industrial Group', '2021 — 2022', 'Northgate, OH', ARRAY['Ran field execution for a 280,000 sq ft distribution warehouse','Tracked installed quantities against budgeted units for monthly draw','Delivered substantial completion on schedule with zero LTI'], 1),
  ('Field Engineer & Trade Coordinator', 'Harborview Construction', '2019 — 2021', 'Harbor City, WA', ARRAY['Supported vertical construction of a 22-story mixed-use tower','Introduced anchor-bolt field verification checklist — rejection rate <1.5%','Maintained as-builts and field change orders for a $74M build'], 2),
  ('Project Engineer', 'Westside Residential Builders', '2018 — 2019', 'Westside, TX', ARRAY['Field coordination for an 84-unit mid-rise residential project','Managed submittals and RFIs for plumbing and HVAC scopes','98% first-time waterproofing inspection pass rate'], 3),
  ('Mechanical Coordinator', 'Eastpoint Municipal Contractors', '2017 — 2018', 'Eastpoint, FL', ARRAY['Mechanical scope coordination for a pump station retrofit','Led hydrostatic testing and commissioning sequence','Re-sequenced piping plan to absorb late equipment delivery'], 4)
) AS v(role, company, period, location, highlights, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM work_history);

-- ---------------------------------------------------------------------------
-- 3. credentials
-- ---------------------------------------------------------------------------
INSERT INTO credentials (label, detail, icon_key, sort_order)
SELECT * FROM (VALUES
  ('OSHA 30-Hour Construction', 'Safety certification, current', 'ShieldCheck', 0),
  ('BIM Coordination', 'Navisworks clash detection & shared model', 'Layers', 1),
  ('Construction Document Control', 'Submittal, RFI, and close-out workflows', 'ClipboardList', 2)
) AS v(label, detail, icon_key, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM credentials);

-- ---------------------------------------------------------------------------
-- 4. skill_groups + skills
-- ---------------------------------------------------------------------------
INSERT INTO skill_groups (label, icon_key, sort_order)
SELECT * FROM (VALUES
  ('Field Execution', 'HardHat', 0),
  ('Mechanical & Electrical', 'Zap', 1),
  ('Project Controls', 'ClipboardList', 2),
  ('Coordination & Communication', 'Users', 3),
  ('Standards & Safety', 'ShieldCheck', 4),
  ('Tools & Software', 'Layers', 5)
) AS v(label, icon_key, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skill_groups);

-- Skills: insert each group's skills referencing the just-created group ids.
INSERT INTO skills (group_id, label, sort_order)
SELECT g.id, s.label, s.sort_order
FROM (VALUES
  ('Field Execution', 'MEP rough-in & trim coordination', 0),
  ('Field Execution', 'Anchor bolt installation & verification', 1),
  ('Field Execution', 'Composite floor systems', 2),
  ('Field Execution', 'Structural steel erection sequencing', 3),
  ('Field Execution', 'Concrete pour layout & QA', 4),
  ('Mechanical & Electrical', 'Mechanical scope oversight (HVAC, medical gas, piping)', 0),
  ('Mechanical & Electrical', 'Electrical distribution & branch coordination', 1),
  ('Mechanical & Electrical', 'Commissioning & hydrostatic testing', 2),
  ('Mechanical & Electrical', 'Fire suppression systems', 3),
  ('Mechanical & Electrical', 'CRAC / chilled water cooling', 4),
  ('Project Controls', 'Submittal & RFI management', 0),
  ('Project Controls', 'Installed-quantity tracking vs. budget', 1),
  ('Project Controls', 'Critical-path scheduling', 2),
  ('Project Controls', 'Monthly draw documentation', 3),
  ('Project Controls', 'As-built & close-out packages', 4),
  ('Coordination & Communication', 'Subcontractor coordination across trades', 0),
  ('Coordination & Communication', 'Weekly trade coordination meetings', 1),
  ('Coordination & Communication', 'Clash detection / shared coordination model', 2),
  ('Coordination & Communication', 'Owner & AHJ interface', 3),
  ('Coordination & Communication', 'Field change order documentation', 4),
  ('Standards & Safety', 'OSHA field compliance', 0),
  ('Standards & Safety', 'AISC erection tolerances', 1),
  ('Standards & Safety', 'Arc-flash labeling & live-work permits', 2),
  ('Standards & Safety', 'Waterproofing QA / mock-ups', 3),
  ('Standards & Safety', 'Inspection readiness', 4),
  ('Tools & Software', 'Navisworks / BIM coordination', 0),
  ('Tools & Software', 'AutoCAD & Revit (coordination use)', 1),
  ('Tools & Software', 'Procore / field management platforms', 2),
  ('Tools & Software', 'MS Project / Primavera scheduling', 3),
  ('Tools & Software', 'Spec & submittal workflow tools', 4)
) AS s(group_label, label, sort_order)
JOIN skill_groups g ON g.label = s.group_label
WHERE NOT EXISTS (SELECT 1 FROM skills);

-- ---------------------------------------------------------------------------
-- 5. projects
-- ---------------------------------------------------------------------------
INSERT INTO projects (slug, name, role, type, scope, timeframe, location, value, photos, technical_scope, challenges, systems, outcome, featured, hidden, sort_order)
SELECT * FROM (VALUES
  ('riverside-medical-center'::text, 'Riverside Medical Center — Phase II'::text, 'MEP Coordinator & Field Supervisor'::text, 'commercial'::text,
   'Oversaw mechanical and electrical scope across a 120,000 sq ft hospital wing, coordinating four prime subcontractors and rough-in through trim.'::text,
   '2022 — 2024'::text, 'Riverside, CA'::text, '$48M'::text,
   ARRAY['https://images.pexels.com/photos/8482546/pexels-photo-8482546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/5511065/pexels-photo-5511065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/5693845/pexels-photo-5693845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Coordinated MEP rough-in across 6 floors with clash detection against structural model','Managed submittal and approval cycle for 240+ MEP equipment items','Led field installation of composite floor systems with embedded conduit runs','Chaired weekly trade coordination meetings with GC, structural, and MEP primes']::text[],
   ARRAY['Tight ceiling plenum on ICU floors required re-routing of ductwork and cable trays without losing headroom','Phased occupancy meant 60% of the building stayed operational during construction','Anchor installation into post-tensioned slabs demanded engineered layout review per pour']::text[],
   ARRAY['Structural coordination (post-tensioned slabs, composite floor systems)','Mechanical — ductwork, VAV boxes, medical gas','Electrical — distribution, branch, nurse call rough-in','Anchor installation & embedded items']::text[],
   'Delivered the wing 3 weeks ahead of the mechanical substantial completion date with zero failed inspections on the MEP scope. Reduced RFI cycle time by ~40% by running a shared coordination model with the subs.'::text,
   true, false, 0),
  ('northgate-logistics-warehouse'::text, 'Northgate Logistics Distribution Hub'::text, 'Assistant Project Manager'::text, 'industrial'::text,
   'Managed field execution for a 280,000 sq ft distribution warehouse — structural steel erection, dock installation, and MEP commissioning.'::text,
   '2021 — 2022'::text, 'Northgate, OH'::text, '$32M'::text,
   ARRAY['https://images.pexels.com/photos/36003983/pexels-photo-36003983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/11581108/pexels-photo-11581108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Coordinated structural steel erection sequence with crane access plan','Managed dock-leveler and door installation across 84 loading positions','Oversaw MEP commissioning for conveyor-ready power and lighting','Tracked installed quantities against budgeted units for monthly draw']::text[],
   ARRAY['Winter erection schedule required wind and temperature thresholds per OSHA and AISC','Conveyor vendor integration collided with electrical distribution routing']::text[],
   ARRAY['Structural steel erection & detailing','Dock & loading systems','Electrical distribution for material handling']::text[],
   'Substantial completion achieved on schedule. Steel erection finished with zero lost-time incidents across 14 weeks. Close-out package delivered within 30 days of owner walk.'::text,
   false, false, 1),
  ('harbor-view-tower'::text, 'Harbor View Tower'::text, 'Field Engineer & Trade Coordinator'::text, 'commercial'::text,
   'Supported vertical construction of a 22-story mixed-use tower — concrete, anchors, and MEP rough-in coordination.'::text,
   '2019 — 2021'::text, 'Harbor City, WA'::text, '$74M'::text,
   ARRAY['https://images.pexels.com/photos/14169558/pexels-photo-14169558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7108785/pexels-photo-7108785.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/15532135/pexels-photo-15532135.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Layout and verification of anchor bolt installations on concrete core pours','Coordinated MEP rough-in for residential and commercial floors','Maintained as-built documentation and field change orders','Managed subcontractor daily reports and installed-quantity tracking']::text[],
   ARRAY['Anchor bolt tolerances on the core required ±6mm — needed field verification each pour','MEP rough-in competed with finishes on a fast-tracked 5-day/floor cycle']::text[],
   ARRAY['Anchor installation & verification','Concrete core & slab-on-metal-deck','MEP rough-in coordination']::text[],
   '22-story structure topped out on schedule. Anchor bolt rejection rate held below 1.5% across all pours through a field-verification checklist introduced before each pour.'::text,
   false, false, 2),
  ('westside-midrise-residences'::text, 'Westside Mid-Rise Residences'::text, 'Project Engineer'::text, 'residential'::text,
   'Field coordination for a 6-story, 84-unit residential build — structural, MEP, and exterior envelope.'::text,
   '2018 — 2019'::text, 'Westside, TX'::text, '$18M'::text,
   ARRAY['https://images.pexels.com/photos/8469983/pexels-photo-8469983.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/7937367/pexels-photo-7937367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/19408681/pexels-photo-19408681.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Coordinated structural and MEP drawings for conflict resolution','Managed submittals and RFIs for plumbing and HVAC scopes','Oversaw exterior envelope installation and waterproofing QA','Scheduled and tracked subcontractor field progress weekly']::text[],
   ARRAY['Plenum space constraints required redesign of plumbing waste runs','Waterproofing detail at balconies needed multiple field mock-ups']::text[],
   ARRAY['Plumbing & HVAC coordination','Exterior envelope & waterproofing','Structural coordination']::text[],
   'Project delivered with a 98% first-time waterproofing inspection pass rate. Balcony mock-up process adopted as standard on the firm''s next two residential builds.'::text,
   false, false, 3),
  ('eastpoint-pump-station'::text, 'Eastpoint Pump Station Upgrade'::text, 'Mechanical Coordinator'::text, 'infrastructure'::text,
   'Mechanical scope coordination for a municipal pump station retrofit — piping, equipment setting, and commissioning.'::text,
   '2017 — 2018'::text, 'Eastpoint, FL'::text, '$11M'::text,
   ARRAY['https://images.pexels.com/photos/5693845/pexels-photo-5693845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/37685875/pexels-photo-37685875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/34581643/pexels-photo-34581643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Coordinated mechanical equipment setting with civil and electrical scopes','Managed piping fabrication and field weld inspections','Led hydrostatic testing and commissioning sequence','Tracked vendor deliveries against the critical path schedule']::text[],
   ARRAY['Station remained partially operational during retrofit — sequencing was mission-critical','Custom pump skeds arrived late, requiring field re-sequencing of piping runs']::text[],
   ARRAY['Mechanical piping & equipment setting','Hydrostatic testing & commissioning','Civil / mechanical interface']::text[],
   'Station returned to full capacity on schedule. Late sked delivery absorbed with a re-sequenced piping plan that kept the critical path intact.'::text,
   false, false, 4),
  ('summit-data-center-fitout'::text, 'Summit Data Center — Phase A Fit-Out'::text, 'MEP Field Supervisor'::text, 'commercial'::text,
   'Field supervision of MEP fit-out for a Tier III data hall — power distribution, cooling, and fire suppression systems.'::text,
   '2020'::text, 'Summit, VA'::text, '$26M'::text,
   ARRAY['https://images.pexels.com/photos/103587/pexels-photo-103587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/18569736/pexels-photo-18569736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/10065200/pexels-photo-10065200.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']::text[],
   ARRAY['Supervised installation of power distribution to white-space racks','Coordinated CRAC unit placement and chilled water loop tie-ins','Oversaw clean-agent fire suppression piping and nozzle layout','Managed arc-flash labeling and commissioning documentation']::text[],
   ARRAY['Energized adjacent halls required live-work permits and strict isolation protocols','Nozzle placement had to reconcile with rack airflow modeling']::text[],
   ARRAY['Electrical distribution & arc-flash labeling','CRAC cooling & chilled water','Clean-agent fire suppression']::text[],
   'Data hall energized on schedule with zero safety incidents during live-work. Fire suppression nozzle layout approved on first review by the authority having jurisdiction.'::text,
   false, false, 5)
) AS v(slug, name, role, type, scope, timeframe, location, value, photos, technical_scope, challenges, systems, outcome, featured, hidden, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- ---------------------------------------------------------------------------
-- 6. blog_posts
-- ---------------------------------------------------------------------------
INSERT INTO blog_posts (slug, title, excerpt, body, category, cover_image, published_at, status)
SELECT * FROM (VALUES
  ('where-field-crews-lose-money-in-the-estimate'::text, 'Where Field Crews Lose Money in the Estimate'::text,
   'Most estimating misses come from assumptions nobody wrote down — and the field crew pays for them later. A back-up that names the risk instead of padding it.'::text,
   '## Where field crews lose money in the estimate

Most estimating misses I''ve seen don''t come from bad unit costs. They come from **assumptions nobody wrote down** — and the field crew pays for them later.

### The usual suspects

- **Crew composition assumed for perfect access.** Reality: tight plenums, occupied floors, and phasing cut productivity by 20–30%.
- **No allowance for coordination rework.** Clash-driven re-routes are not "extras" on a coordinated build — they''re a cost line.
- **Submittal cycle time ignored.** Long approvals push procurement into expediting and overtime.

> An estimate that doesn''t account for coordination rework is a budget the field will have to renegotiate.

### What I build into the back-up

| Line | Typical miss | Better back-up |
| ---- | ------------ | -------------- |
| Rough-in labor | Straight crew-hours | +15% for phasing & rework |
| Procurement | PO date = ship date | +10 days for submittal/approval |
| Coordination | Loaded in PM hours | Dedicated coordinator line |

```spec
ESTIMATE BACK-UP — MEP ROUGH-IN
  crew:  1 foreman + 4 journeymen
  access: plenum < 24in on ICU floors -> productivity x0.75
  rework: +15% for clash-driven re-routes
  submittal: +10 calendar days to PO
```

The point isn''t to pad — it''s to name the risk so it can be managed instead of absorbed.'::text,
   'estimating'::text, NULL::text, '2024-09-12'::date, 'published'::text),
  ('when-the-anchor-layout-doesnt-match-the-pour'::text, 'When the Anchor Layout Doesn''t Match the Pour'::text,
   'Out-of-tolerance anchor bolts are usually a process problem, not a craft problem. A two-gate field check that cut rejection below 1.5%.'::text,
   '## When the anchor layout doesn''t match the pour

On a 22-story tower we caught anchor bolts out of tolerance ```±6mm``` on the second deck. The fix was not on the ironworker — it was in the process.

### What was wrong

The layout crew set anchors from the issued-for-construction drawings, but the drawings hadn''t been updated to reflect a column relocation from an RFI response. The bolts were installed ```as drawn```, not ```as coordinated```.

### The field fix

We introduced a two-gate check before every pour:

1. **Layout verification** — field engineer confirms anchor positions against the **current** coordinated set, not the IFC stamp date.
2. **Pour hold** — no concrete until the verification sheet is signed and posted at the pour location.

> The drawing stamp date is not the truth. The last coordination response is the truth.

### Result

Rejection rate dropped below 1.5% across the remaining 20 pours. The cost was one hour per pour of field-engineer time — far cheaper than a torch and a re-pour.'::text,
   'field-ops'::text, NULL::text, '2024-07-30'::date, 'published'::text),
  ('subcontractor-disputes-settle-it-on-the-slab'::text, 'Subcontractor Disputes: Settle It on the Slab, Not in Discovery'::text,
   'The most expensive change orders start as a conversation that didn''t happen. Three field habits that prevent disputes before attorneys get involved.'::text,
   '## Subcontractor disputes: settle it on the slab, not in discovery

The most expensive change orders I''ve worked on were the ones that started as a **conversation that didn''t happen**.

### Three habits that prevent disputes

- **Daily scope confirmation.** If a trade is about to install work another trade claims, stop and confirm in writing — same day.
- **RFIs with a proposed solution.** A question that proposes an answer gets resolved in days; an open question sits for weeks.
- **Marked-up drawings on the wall.** Field coordination is easier to defend when there''s a physical record, not just a model file.

```spec
DISPUTE AVOIDANCE — FIELD RULE
  1. overlap -> stop work -> same-day written confirmation
  2. RFI -> always include proposed solution
  3. coordination -> marked-up drawing posted + dated
```

### When it still goes sideways

Even with good habits, overlaps happen. The projects that resolved cleanly had one thing in common: **the field conversation happened before the paperwork did**. Once attorneys are driving, you''ve already lost the cost of the work plus the cost of the argument.'::text,
   'disputes'::text, NULL::text, '2024-06-04'::date, 'published'::text),
  ('composite-floor-systems-embedded-conduit'::text, 'Composite Floor Systems and Embedded Conduit: A Coordination Note'::text,
   'Embedding conduit in a composite slab saves plenum space but creates a structural coordination problem easy to miss until the pour.'::text,
   '## Composite floor systems and embedded conduit: a coordination note

Embedding electrical conduit in a composite slab saves plenum space but creates a structural coordination problem that''s easy to miss until the pour.

### The constraint

Conduit and outlets embedded in the slab **reduce the effective concrete section**. The structural engineer''s allowance for embedment isn''t infinite — and it''s rarely shown on the electrical drawings.

### What I check before approving the conduit layout

- **Total embedment area per bay** — stay under the engineer''s stated limit (often ~1% of slab cross-section).
- **Minimum cover** — keep conduit below the top mat and clear of the shear studs.
- **Conduit stacking** — no bundled runs in the slab; single layer only.

> The electrician''s "cleanest route" and the structural engineer''s "valid slab" are not the same drawing. Reconcile them before the pour, not during.

```spec
COMPOSITE SLAB — EMBED CHECK
  max embedment: 1% of slab cross-section per bay
  cover: below top mat, >= 1in clear to shear studs
  bundling: single layer only, no stacked runs
```

Catch this in coordination and the pour is boring. Miss it and you''re x-raying a finished floor.'::text,
   'structural-review'::text, NULL::text, '2024-04-18'::date, 'published'::text),
  ('field-ops-the-daily-report-is-a-budget-document'::text, 'Field Ops: The Daily Report Is a Budget Document'::text,
   'A useful daily report describes what happened against the plan — so a delay claim three months later is a print job, not a reconstruction.'::text,
   '## Field ops: the daily report is a budget document

Most daily reports I see describe what happened. The useful ones describe **what happened against the plan**.

### What a useful daily includes

- **Installed quantities** — not just "poured 40 yards" but "40 of 120 planned (33%)".
- **Crew on site vs. planned** — if you planned 6 and had 4, that''s a schedule risk, not a note.
- **Decisions made in the field** — with who decided and against what drawing.

```spec
DAILY REPORT — BUDGET LENS
  installed: qty / planned qty (% to date)
  crew: planned N, actual M -> variance reason
  decisions: who, what, against which drawing
```

### Why it matters

A daily report written this way becomes the back-up for a **time impact analysis** without a scramble. When a dispute or a delay claim shows up three months later, you''re not reconstructing the field history — you''re printing it.'::text,
   'field-ops'::text, NULL::text, '2024-02-22'::date, 'published'::text),
  ('structural-review-on-a-fast-tracked-build'::text, 'Structural Review on a Fast-Tracked Build: What to Push Back On'::text,
   'Fast-tracked structures issue before MEP coordination is done. Here''s what the field team has to own — and what to ask for in review.'::text,
   '## Structural review on a fast-tracked build: what to push back on

Fast-tracked projects issue structural packages before MEP coordination is complete. That''s the model — but it creates a specific set of risks the field team has to own.

### Where fast-track breaks

- **Anchor and embed locations** issued before equipment is approved.
- **Slab openings** released before mechanical routing is fixed.
- **Post-tensioned slab layouts** that don''t yet reflect the MEP penetrations.

### What I ask for in review

1. **Hold points** on anchors and penetrations until the relevant submittal is approved.
2. **A coordination set** that supersedes the IFC for embedment only — clearly marked.
3. **A field verification sheet** for anything that touches PT tendons.

> On a fast-tracked job, "issued for construction" is a starting point, not an endpoint. The field team carries the reconciliation.

```spec
FAST-TRACK — STRUCTURAL REVIEW
  anchors/penetrations: hold until submittal approved
  coordination set: supersedes IFC for embedment, marked
  PT slab: field verification sheet mandatory
```

Push back on these early. The cost of a revision on paper is a rounding error next to a revision in concrete.'::text,
   'structural-review'::text, NULL::text, '2023-11-09'::date, 'published'::text)
) AS v(slug, title, excerpt, body, category, cover_image, published_at, status)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts);

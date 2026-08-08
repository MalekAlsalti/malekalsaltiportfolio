/*
# Portfolio content schema + admin authentication

This migration creates the full content-management schema for Malek Alsalti's
portfolio site, plus the access model for a secure single-admin panel.

## Overview

The public site (no sign-in) reads all published content. The admin panel
(sign-in required) can create, edit, delete, and reorder everything. The admin
is a single authenticated user (Supabase email/password auth). Public visitors
also submit contact inquiries through the contact form.

## New Tables

1. `site_settings` — single row (key/value style not needed; one row holds all
   homepage + contact settings). Columns:
   - `id` (int, primary key, always 1)
   - `hero_name` text — e.g. "Malek Alsalti"
   - `hero_title` text — professional title
   - `hero_intro` text — intro paragraph under the hero
   - `duty_summary` text — the highlighted one-sentence duty summary
   - `availability_badge` text — e.g. "Available for Freelance Work"
   - `availability_enabled` boolean — show/hide the badge
   - `contact_email` text
   - `contact_phone` text
   - `linkedin_url` text
   - `location` text
   - `resume_pdf_url` text — path/URL to the downloadable resume PDF
   - `updated_at` timestamptz

2. `work_history` — resume work history entries. Columns:
   - `id` uuid pk
   - `role` text
   - `company` text
   - `period` text
   - `location` text
   - `highlights` text[] — bullet highlights
   - `sort_order` int (default 0)
   - `created_at` timestamptz

3. `credentials` — certifications / credentials. Columns:
   - `id` uuid pk
   - `label` text
   - `detail` text
   - `icon_key` text — optional icon identifier
   - `sort_order` int
   - `created_at` timestamptz

4. `skill_groups` — skill categories. Columns:
   - `id` uuid pk
   - `label` text
   - `icon_key` text
   - `sort_order` int
   - `created_at` timestamptz

5. `skills` — skills belonging to a group. Columns:
   - `id` uuid pk
   - `group_id` uuid fk -> skill_groups(id) ON DELETE CASCADE
   - `label` text
   - `sort_order` int
   - `created_at` timestamptz

6. `projects` — portfolio projects. Columns:
   - `id` uuid pk
   - `slug` text unique
   - `name` text
   - `role` text
   - `type` text — commercial | industrial | residential | infrastructure
   - `scope` text
   - `timeframe` text
   - `location` text
   - `value` text (nullable)
   - `photos` text[] — array of image URLs
   - `technical_scope` text[]
   - `challenges` text[]
   - `systems` text[]
   - `outcome` text
   - `featured` boolean default false
   - `hidden` boolean default false
   - `sort_order` int
   - `created_at` timestamptz

7. `blog_posts` — blog articles. Columns:
   - `id` uuid pk
   - `slug` text unique
   - `title` text
   - `excerpt` text
   - `body` text — markdown
   - `category` text
   - `cover_image` text (nullable)
   - `published_at` date (nullable)
   - `status` text — 'draft' | 'published'
   - `created_at` timestamptz
   - `updated_at` timestamptz

8. `contact_messages` — already exists (contact form submissions). We extend it
   with an `inquiry_type` column and ensure RLS is correct.

## Security / RLS

- `site_settings`, `work_history`, `credentials`, `skill_groups`, `skills`,
  `projects`, `blog_posts`: public SELECT (anon + authenticated) so the
  no-auth public site can read published content. All writes (insert/update/
  delete) restricted to `authenticated` (the signed-in admin).
- `contact_messages`: public INSERT (anon can submit the form). No public
  SELECT/UPDATE/DELETE. `authenticated` (admin) gets full CRUD to manage the
  inbox.
- Every table has RLS enabled.

## Important notes

1. The admin is a single Supabase auth user (email/password). The admin's
   user id is not stored in content rows — content is global, owned by the
   one admin. `authenticated`-only write policies are sufficient because only
   the admin has an account.
2. `site_settings` is constrained to a single row via a check on id = 1.
3. Seed data is inserted in a follow-up migration so the public site is
   populated immediately and the admin sees existing content to edit.
*/

-- ---------------------------------------------------------------------------
-- site_settings (single row)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_name text NOT NULL DEFAULT 'Malek Alsalti',
  hero_title text NOT NULL DEFAULT 'Construction & Project Management Professional',
  hero_intro text NOT NULL DEFAULT '',
  duty_summary text NOT NULL DEFAULT '',
  availability_badge text NOT NULL DEFAULT 'Available for Freelance Work',
  availability_enabled boolean NOT NULL DEFAULT true,
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  resume_pdf_url text NOT NULL DEFAULT '/Malek-Alsalti-Resume.pdf',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_site_settings" ON site_settings;
CREATE POLICY "public_select_site_settings"
ON site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings"
ON site_settings FOR UPDATE
TO authenticated WITH CHECK (true);

-- Ensure the single row exists
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- work_history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  location text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_work_history" ON work_history;
CREATE POLICY "public_select_work_history"
ON work_history FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_work_history" ON work_history;
CREATE POLICY "admin_insert_work_history"
ON work_history FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_work_history" ON work_history;
CREATE POLICY "admin_update_work_history"
ON work_history FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_work_history" ON work_history;
CREATE POLICY "admin_delete_work_history"
ON work_history FOR DELETE
TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- credentials
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  detail text NOT NULL DEFAULT '',
  icon_key text NOT NULL DEFAULT 'ShieldCheck',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_credentials" ON credentials;
CREATE POLICY "public_select_credentials"
ON credentials FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_credentials" ON credentials;
CREATE POLICY "admin_insert_credentials"
ON credentials FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_credentials" ON credentials;
CREATE POLICY "admin_update_credentials"
ON credentials FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_credentials" ON credentials;
CREATE POLICY "admin_delete_credentials"
ON credentials FOR DELETE
TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- skill_groups
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon_key text NOT NULL DEFAULT 'HardHat',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE skill_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_skill_groups" ON skill_groups;
CREATE POLICY "public_select_skill_groups"
ON skill_groups FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skill_groups" ON skill_groups;
CREATE POLICY "admin_insert_skill_groups"
ON skill_groups FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skill_groups" ON skill_groups;
CREATE POLICY "admin_update_skill_groups"
ON skill_groups FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skill_groups" ON skill_groups;
CREATE POLICY "admin_delete_skill_groups"
ON skill_groups FOR DELETE
TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES skill_groups(id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_skills" ON skills;
CREATE POLICY "public_select_skills"
ON skills FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills"
ON skills FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills"
ON skills FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills"
ON skills FOR DELETE
TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS skills_group_id_idx ON skills(group_id);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'commercial',
  scope text NOT NULL DEFAULT '',
  timeframe text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  value text,
  photos text[] NOT NULL DEFAULT '{}',
  technical_scope text[] NOT NULL DEFAULT '{}',
  challenges text[] NOT NULL DEFAULT '{}',
  systems text[] NOT NULL DEFAULT '{}',
  outcome text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_projects" ON projects;
CREATE POLICY "public_select_projects"
ON projects FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects"
ON projects FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects"
ON projects FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects"
ON projects FOR DELETE
TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'field-ops',
  cover_image text,
  published_at date,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_blog_posts" ON blog_posts;
CREATE POLICY "public_select_blog_posts"
ON blog_posts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts"
ON blog_posts FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts"
ON blog_posts FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts"
ON blog_posts FOR DELETE
TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- contact_messages: add inquiry_type column + fix policies
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'inquiry_type'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN inquiry_type text NOT NULL DEFAULT 'General inquiry';
  END IF;
END $$;

-- Replace any overly-permissive policies with the correct set.
-- Public can INSERT only; admin (authenticated) has full CRUD.
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_contact_messages" ON contact_messages;
CREATE POLICY "admin_select_contact_messages"
ON contact_messages FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages"
ON contact_messages FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages"
ON contact_messages FOR DELETE
TO authenticated USING (true);

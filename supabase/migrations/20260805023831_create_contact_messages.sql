/*
# Create contact_messages table (single-tenant, no auth)

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's full name
  - `email` (text, not null) — sender's email address
  - `company` (text, nullable) — optional company/organization
  - `project_type` (text, nullable) — optional project type (commercial, industrial, etc.)
  - `message` (text, not null) — the message body
  - `created_at` (timestamptz, default now())
  - `status` (text, default 'new') — read/unread/handled flag for the site owner

2. Security
- Enable RLS on `contact_messages`.
- This is a no-auth portfolio site: the public contact form must be able to INSERT
  via the anon key. SELECT/UPDATE/DELETE are intentionally NOT granted to anon or
  authenticated — only the owner can read/manage submissions server-side.
- INSERT policy is `TO anon, authenticated WITH CHECK (true)` so the public form
  can submit. Allowing anyone to insert a contact message is the intended behavior
  of a public contact form.

3. Important notes
- No PII beyond standard contact-form fields is stored.
- Messages are owned server-side (no user accounts); the site owner reviews them
  through the Supabase dashboard or a future authenticated admin view.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project_type text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit contact messages (intended: public contact form).
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon or authenticated; owner manages server-side.

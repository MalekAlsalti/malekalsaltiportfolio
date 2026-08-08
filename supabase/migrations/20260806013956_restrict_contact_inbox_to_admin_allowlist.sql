/*
# Restrict the contact inbox to an explicit admin allowlist

1. New Tables
- `admin_users`
  - `user_id` (uuid, primary key) — an account that is allowed to administer the site
  - `created_at` (timestamptz)

2. Security changes
- Enable RLS on `admin_users`. An authenticated account may read ONLY its own row,
  which is what makes the `EXISTS (...)` check inside other policies work while
  keeping the allowlist itself unreadable to everyone else. No INSERT/UPDATE/DELETE
  policies exist, so the list can only be changed with a privileged migration.
- `contact_messages` SELECT/UPDATE/DELETE were previously granted to EVERY
  authenticated account with an always-true predicate. They are now restricted to
  accounts present in `admin_users`. The public INSERT policy is untouched so the
  contact form keeps working.

3. Important notes
1. The existing administrator account is seeded into `admin_users` by looking the
   address up in `auth.users`, so no id is hardcoded.
2. Re-runnable: policies are dropped before being recreated and the seed is guarded.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_can_read_own_admin_row" ON admin_users;
CREATE POLICY "admin_can_read_own_admin_row" ON admin_users FOR SELECT
  TO authenticated USING (user_id = auth.uid());

INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'admin@malekalsalti.com'
  AND NOT EXISTS (SELECT 1 FROM admin_users);

DROP POLICY IF EXISTS "admin_select_contact_messages" ON contact_messages;
CREATE POLICY "admin_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

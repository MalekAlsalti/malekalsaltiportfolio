/*
# Stop serving hidden projects to the public

1. Modified tables
- `projects` (SELECT policy only)

2. Security changes
- The public SELECT policy previously used `USING (true)`, so projects flagged
  `hidden` were still returned by the data API and only filtered in the browser.
  Anonymous visitors now receive a project row only when `hidden = false`. Accounts
  listed in `admin_users` still see every row so the projects manager keeps working.

3. Important notes
1. Re-runnable: the policy is dropped before being recreated.
*/

DROP POLICY IF EXISTS "public_select_projects" ON projects;
CREATE POLICY "public_select_projects" ON projects FOR SELECT
  TO anon, authenticated
  USING (
    hidden = false
    OR EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid())
  );

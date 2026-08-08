/*
# Restrict all content writes to the admin allowlist

1. Modified tables (policies only, no data or column changes)
- `site_settings`, `blog_posts`, `projects`, `work_history`, `credentials`,
  `skill_groups`, `skills`

2. Security changes
- Every INSERT/UPDATE/DELETE policy on these tables previously applied to EVERY
  authenticated account with an always-true predicate, meaning any account that
  could be created also had full control of the site's content. Each policy now
  requires the caller to be listed in `admin_users`.
- Public SELECT policies are deliberately left unchanged here so the public site
  keeps reading content with the anon key.
- `site_settings` gains explicit INSERT/DELETE policies restricted to the admin so
  the table is not silently write-open through a missing policy in future.

3. Important notes
1. Re-runnable: every policy is dropped before being recreated.
2. No table-level grants are revoked, so `select('*')` queries in the app are unaffected.
*/

-- site_settings
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- blog_posts
DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- projects
DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- work_history
DROP POLICY IF EXISTS "admin_insert_work_history" ON work_history;
CREATE POLICY "admin_insert_work_history" ON work_history FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_work_history" ON work_history;
CREATE POLICY "admin_update_work_history" ON work_history FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_work_history" ON work_history;
CREATE POLICY "admin_delete_work_history" ON work_history FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- credentials
DROP POLICY IF EXISTS "admin_insert_credentials" ON credentials;
CREATE POLICY "admin_insert_credentials" ON credentials FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_credentials" ON credentials;
CREATE POLICY "admin_update_credentials" ON credentials FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_credentials" ON credentials;
CREATE POLICY "admin_delete_credentials" ON credentials FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- skill_groups
DROP POLICY IF EXISTS "admin_insert_skill_groups" ON skill_groups;
CREATE POLICY "admin_insert_skill_groups" ON skill_groups FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_skill_groups" ON skill_groups;
CREATE POLICY "admin_update_skill_groups" ON skill_groups FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_skill_groups" ON skill_groups;
CREATE POLICY "admin_delete_skill_groups" ON skill_groups FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

-- skills
DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills" ON skills FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills" ON skills FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid()));

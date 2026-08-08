/*
# Stop serving unpublished blog drafts to the public

1. Modified tables
- `blog_posts` (SELECT policy only)

2. Security changes
- The public SELECT policy previously used `USING (true)`, so unpublished drafts
  were returned by the data API to anyone using the public key; only the browser
  filtered them out. The policy now returns a row to anonymous visitors only when
  `status = 'published'`. Accounts listed in `admin_users` continue to see every
  row so the admin blog manager keeps working.

3. Important notes
1. Re-runnable: the policy is dropped before being recreated.
*/

DROP POLICY IF EXISTS "public_select_blog_posts" ON blog_posts;
CREATE POLICY "public_select_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM admin_users a WHERE a.user_id = auth.uid())
  );

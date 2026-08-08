/*
# Create project + blog image storage bucket

1. Storage
- Create a public bucket `portfolio-media` for project photos and blog cover
  images uploaded through the admin panel.
2. Security
- Public read access (anyone can view uploaded images).
- Only authenticated users (the admin) can upload/update/delete objects.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "public_read_portfolio_media" ON storage.objects;
CREATE POLICY "public_read_portfolio_media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-media');

-- Authenticated upload
DROP POLICY IF EXISTS "admin_insert_portfolio_media" ON storage.objects;
CREATE POLICY "admin_insert_portfolio_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated update
DROP POLICY IF EXISTS "admin_update_portfolio_media" ON storage.objects;
CREATE POLICY "admin_update_portfolio_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated delete
DROP POLICY IF EXISTS "admin_delete_portfolio_media" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media');

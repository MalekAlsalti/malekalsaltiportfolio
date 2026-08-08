/*
# Restrict media bucket writes to the admin, and constrain accepted files

1. Modified objects
- `storage.objects` policies for the `portfolio-media` bucket
- `storage.buckets` row `portfolio-media` (size and mime limits)

2. Security changes
- Uploading, overwriting and deleting files in `portfolio-media` previously applied
  to EVERY authenticated account, which allowed arbitrary file hosting on the site's
  own domain and silent replacement of the resume PDF at its fixed path. All three
  write policies now require the caller to be listed in `admin_users`.
- Public read of the bucket is unchanged, since project photos, blog covers and the
  resume PDF are intentionally public.
- The bucket now enforces a 10 MB size limit and an allow-list of mime types
  (jpeg, png, webp, gif, svg, avif, pdf) server-side, so the browser-side
  file-picker filter is no longer the only check.

3. Important notes
1. Re-runnable: policies are dropped before being recreated.
*/

DROP POLICY IF EXISTS "admin_insert_portfolio_media" ON storage.objects;
CREATE POLICY "admin_insert_portfolio_media" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_update_portfolio_media" ON storage.objects;
CREATE POLICY "admin_update_portfolio_media" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_delete_portfolio_media" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_media" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid())
  );

UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/avif','application/pdf'
    ]
WHERE id = 'portfolio-media';

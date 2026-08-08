/*
# Constrain public contact form submissions

1. Modified tables
- `contact_messages` (constraints and INSERT policy; no columns or data changed)

2. Security changes
- The public INSERT policy used `WITH CHECK (true)` with every column insertable, so
  a caller could submit unbounded amounts of text and could also set `status`
  themselves (e.g. straight to 'handled', hiding the message from the owner's inbox).
- New CHECK constraints bound the length of every text field and restrict `status`
  to the three values the admin inbox understands.
- The INSERT policy now additionally requires `status = 'new'` and a plausible email
  shape, so submissions always arrive as unread and cannot pre-set their own state.

3. Important notes
1. The table is currently empty, so the constraints validate immediately.
2. The contact form does not send `status`, so the column default 'new' satisfies the
   policy and the form continues to work unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_lengths_check') THEN
    ALTER TABLE contact_messages ADD CONSTRAINT contact_messages_lengths_check CHECK (
      length(name) BETWEEN 1 AND 200
      AND length(email) BETWEEN 3 AND 320
      AND length(message) BETWEEN 1 AND 5000
      AND (company IS NULL OR length(company) <= 200)
      AND (project_type IS NULL OR length(project_type) <= 60)
      AND length(inquiry_type) <= 60
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_status_check') THEN
    ALTER TABLE contact_messages ADD CONSTRAINT contact_messages_status_check CHECK (
      status IN ('new', 'read', 'handled')
    );
  END IF;
END $$;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND position('@' in email) > 1
    AND length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND length(message) BETWEEN 1 AND 5000
  );

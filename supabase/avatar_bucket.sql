INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);

CREATE POLICY "Allow users to upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND owner_id::text = auth.uid()::text 
);

CREATE POLICY "Allow users to update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND owner_id::text = auth.uid()::text 
)
WITH CHECK (
  bucket_id = 'avatars' AND owner_id::text = auth.uid()::text 
);

CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND owner_id::text = auth.uid()::text 
);

CREATE POLICY "Allow admins to manage all avatars"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'avatars' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'avatars' AND public.is_admin()
);
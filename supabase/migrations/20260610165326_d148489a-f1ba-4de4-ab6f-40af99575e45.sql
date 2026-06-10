
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admins upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

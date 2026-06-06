
-- ============ EXTRACURRICULAR ============
CREATE TABLE public.extracurricular (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  role text,
  date_text text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.extracurricular TO anon, authenticated;
GRANT ALL ON public.extracurricular TO authenticated, service_role;
ALTER TABLE public.extracurricular ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view extracurricular" ON public.extracurricular FOR SELECT USING (true);
CREATE POLICY "Admins manage extracurricular" ON public.extracurricular FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_extracurricular_updated BEFORE UPDATE ON public.extracurricular FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAPERS ============
CREATE TABLE public.papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  abstract text,
  link text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.papers TO anon, authenticated;
GRANT ALL ON public.papers TO authenticated, service_role;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view papers" ON public.papers FOR SELECT USING (true);
CREATE POLICY "Admins manage papers" ON public.papers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_papers_updated BEFORE UPDATE ON public.papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CV / RESUMES ============
CREATE TABLE public.cv_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  file_path text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cv_resumes TO anon, authenticated;
GRANT ALL ON public.cv_resumes TO authenticated, service_role;
ALTER TABLE public.cv_resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active CVs" ON public.cv_resumes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage CVs" ON public.cv_resumes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cv_updated BEFORE UPDATE ON public.cv_resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CUSTOM SECTIONS ============
CREATE TABLE public.custom_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.custom_sections TO anon, authenticated;
GRANT ALL ON public.custom_sections TO authenticated, service_role;
ALTER TABLE public.custom_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible custom sections" ON public.custom_sections FOR SELECT USING (visible = true);
CREATE POLICY "Admins manage custom sections" ON public.custom_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_custom_sections_updated BEFORE UPDATE ON public.custom_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.custom_section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.custom_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  image_url text,
  link text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.custom_section_items TO anon, authenticated;
GRANT ALL ON public.custom_section_items TO authenticated, service_role;
ALTER TABLE public.custom_section_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view custom items" ON public.custom_section_items FOR SELECT USING (true);
CREATE POLICY "Admins manage custom items" ON public.custom_section_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_custom_items_updated BEFORE UPDATE ON public.custom_section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SECTION VISIBILITY (built-in sections) ============
CREATE TABLE public.section_visibility (
  section_key text PRIMARY KEY,
  visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.section_visibility TO anon, authenticated;
GRANT ALL ON public.section_visibility TO authenticated, service_role;
ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view section visibility" ON public.section_visibility FOR SELECT USING (true);
CREATE POLICY "Admins manage section visibility" ON public.section_visibility FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- seed built-in section keys
INSERT INTO public.section_visibility (section_key, visible) VALUES
  ('extracurricular', true),
  ('cv', true),
  ('papers', true)
ON CONFLICT DO NOTHING;

-- ============ STORAGE POLICIES for cv-files bucket ============
-- bucket is created via the storage tool; add policies on storage.objects
CREATE POLICY "Public can read cv-files" ON storage.objects FOR SELECT USING (bucket_id = 'cv-files');
CREATE POLICY "Admins upload cv-files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cv-files' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update cv-files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cv-files' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete cv-files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cv-files' AND public.has_role(auth.uid(),'admin'));

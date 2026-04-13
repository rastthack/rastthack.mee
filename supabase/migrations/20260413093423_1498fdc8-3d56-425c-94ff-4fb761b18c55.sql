CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  date_obtained TEXT,
  credential_url TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certifications are publicly readable" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Admins can manage certifications" ON public.certifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));
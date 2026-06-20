CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible social links" ON public.social_links FOR SELECT USING (visible = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage social links" ON public.social_links FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
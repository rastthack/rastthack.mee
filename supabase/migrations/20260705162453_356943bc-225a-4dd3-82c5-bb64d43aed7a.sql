
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services readable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.services (title, description, icon, sort_order) VALUES
('Web Penetration Testing', 'Comprehensive security assessments of web applications to identify and exploit vulnerabilities before attackers do.', 'Globe', 1),
('API Penetration Testing', 'Deep-dive testing of REST, GraphQL, and other APIs for auth flaws, injection, and business logic vulnerabilities.', 'Code', 2),
('AI/LLM Testing', 'Security testing for AI systems and LLM applications — prompt injection, model abuse, data leakage, and OWASP LLM Top 10.', 'Brain', 3);

INSERT INTO public.skills (label, description, icon, sort_order)
VALUES ('AI Security Engineer', 'Securing AI/LLM systems — prompt injection defense, model hardening, and OWASP LLM Top 10.', 'Brain', 100);

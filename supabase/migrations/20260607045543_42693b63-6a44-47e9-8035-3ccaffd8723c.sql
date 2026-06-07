DROP POLICY IF EXISTS "Anyone can view custom section items" ON public.custom_section_items;
DROP POLICY IF EXISTS "Public can view custom section items" ON public.custom_section_items;
DROP POLICY IF EXISTS "Custom section items are viewable by everyone" ON public.custom_section_items;

CREATE POLICY "View items of visible sections"
ON public.custom_section_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.custom_sections
    WHERE custom_sections.id = custom_section_items.section_id
      AND custom_sections.visible = true
  )
  OR public.has_role(auth.uid(), 'admin')
);
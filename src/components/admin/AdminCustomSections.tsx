import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  visible: boolean;
  sort_order: number | null;
}
interface Item {
  id: string;
  section_id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  link: string | null;
  sort_order: number | null;
}

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const emptySection = { title: "", slug: "", description: "", visible: true, sort_order: 0 };
const emptyItem = { title: "", content: "", image_url: "", link: "", sort_order: 0 };

const AdminCustomSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<Partial<Section> | null>(null);
  const [isNewSection, setIsNewSection] = useState(false);
  const [editingItem, setEditingItem] = useState<{ sectionId: string; item: Partial<Item>; isNew: boolean } | null>(null);
  const { toast } = useToast();

  const loadSections = async () => {
    const { data } = await supabase.from("custom_sections").select("*").order("sort_order");
    if (data) setSections(data);
  };
  const loadItems = async (sectionId: string) => {
    const { data } = await supabase.from("custom_section_items").select("*").eq("section_id", sectionId).order("sort_order");
    if (data) setItems((prev) => ({ ...prev, [sectionId]: data }));
  };
  useEffect(() => { loadSections(); }, []);

  const saveSection = async () => {
    if (!editingSection?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    const slug = editingSection.slug?.trim() || slugify(editingSection.title!);
    if (isNewSection) {
      const { error } = await supabase.from("custom_sections").insert({ ...emptySection, ...editingSection, title: editingSection.title!, slug });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { id, ...payload } = editingSection;
      const { error } = await supabase.from("custom_sections").update({ ...payload, slug }).eq("id", id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNewSection ? "Section added" : "Section updated" });
    setEditingSection(null); setIsNewSection(false); loadSections();
  };

  const removeSection = async (id: string) => {
    if (!confirm("Delete section and all its items?")) return;
    await supabase.from("custom_sections").delete().eq("id", id);
    toast({ title: "Deleted" }); loadSections();
  };

  const toggleVisible = async (s: Section) => {
    await supabase.from("custom_sections").update({ visible: !s.visible }).eq("id", s.id);
    loadSections();
  };

  const saveItem = async () => {
    if (!editingItem) return;
    const { sectionId, item, isNew } = editingItem;
    if (!item.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("custom_section_items").insert({ ...emptyItem, ...item, title: item.title!, section_id: sectionId });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { id, ...payload } = item;
      const { error } = await supabase.from("custom_section_items").update(payload).eq("id", id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Item added" : "Item updated" });
    setEditingItem(null); loadItems(sectionId);
  };

  const removeItem = async (sectionId: string, id: string) => {
    await supabase.from("custom_section_items").delete().eq("id", id);
    toast({ title: "Deleted" }); loadItems(sectionId);
  };

  const inp = "w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditingSection(emptySection); setIsNewSection(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Custom Section
      </button>

      {editingSection && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Section Title" value={editingSection.title || ""} onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })} className={inp} />
            <input placeholder="Slug (auto if empty)" value={editingSection.slug || ""} onChange={(e) => setEditingSection({ ...editingSection, slug: e.target.value })} className={inp} />
            <textarea placeholder="Description (optional)" value={editingSection.description || ""} onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })} rows={2} className={`${inp} resize-none`} />
            <input type="number" placeholder="Sort order" value={editingSection.sort_order ?? 0} onChange={(e) => setEditingSection({ ...editingSection, sort_order: parseInt(e.target.value) || 0 })} className={inp} />
            <div className="flex gap-2">
              <button onClick={saveSection} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditingSection(null); setIsNewSection(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}

      {sections.map((s) => (
        <GlowCard key={s.id}>
          <div className="flex items-start justify-between gap-4">
            <button onClick={() => { const next = openSection === s.id ? null : s.id; setOpenSection(next); if (next) loadItems(s.id); }} className="flex items-center gap-2 text-left min-w-0">
              <ChevronRight className={`h-4 w-4 text-primary transition-transform ${openSection === s.id ? "rotate-90" : ""}`} />
              <div className="min-w-0">
                <h3 className="text-primary font-bold">{s.title}</h3>
                <p className="text-dim/60 text-xs">/{s.slug} • {s.visible ? "visible" : "hidden"}</p>
              </div>
            </button>
            <div className="flex gap-1">
              <button onClick={() => toggleVisible(s)} className="p-1.5 text-dim hover:text-primary">{s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
              <button onClick={() => { setEditingSection(s); setIsNewSection(false); }} className="p-1.5 text-dim hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => removeSection(s.id)} className="p-1.5 text-dim hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          {openSection === s.id && (
            <div className="mt-4 pl-6 space-y-3 border-l border-primary/10">
              <button onClick={() => setEditingItem({ sectionId: s.id, item: emptyItem, isNew: true })} className="inline-flex items-center gap-1 border border-primary/30 text-primary px-3 py-1.5 rounded text-xs hover:bg-primary/10">
                <Plus className="h-3 w-3" /> Add Item
              </button>

              {editingItem?.sectionId === s.id && (
                <div className="space-y-2 bg-terminal/50 p-3 rounded border border-primary/10">
                  <input placeholder="Title" value={editingItem.item.title || ""} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, title: e.target.value } })} className={inp} />
                  <textarea placeholder="Content" value={editingItem.item.content || ""} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, content: e.target.value } })} rows={3} className={`${inp} resize-none`} />
                  <input placeholder="Image URL (optional)" value={editingItem.item.image_url || ""} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, image_url: e.target.value } })} className={inp} />
                  <input placeholder="Link (optional)" value={editingItem.item.link || ""} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, link: e.target.value } })} className={inp} />
                  <div className="flex gap-2">
                    <button onClick={saveItem} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs"><Save className="h-3 w-3" /> Save</button>
                    <button onClick={() => setEditingItem(null)} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-3 py-1.5 rounded text-xs"><X className="h-3 w-3" /> Cancel</button>
                  </div>
                </div>
              )}

              {(items[s.id] || []).map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-2 text-sm border-b border-primary/5 pb-2">
                  <div className="min-w-0">
                    <p className="text-primary font-semibold text-xs">{it.title}</p>
                    {it.content && <p className="text-dim text-xs line-clamp-2">{it.content}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingItem({ sectionId: s.id, item: it, isNew: false })} className="p-1 text-dim hover:text-primary"><Pencil className="h-3 w-3" /></button>
                    <button onClick={() => removeItem(s.id, it.id)} className="p-1 text-dim hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
              {(items[s.id] || []).length === 0 && <p className="text-dim/60 text-xs">No items yet.</p>}
            </div>
          )}
        </GlowCard>
      ))}
      {sections.length === 0 && !editingSection && <p className="text-dim text-sm text-center py-8">No custom sections yet.</p>}
    </div>
  );
};
export default AdminCustomSections;

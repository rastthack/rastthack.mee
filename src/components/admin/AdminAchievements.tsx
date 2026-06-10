import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string | null;
  date: string | null;
  link: string | null;
  image_url: string | null;
  sort_order: number | null;
}

const empty = { category: "CTF", title: "", description: "", date: "", link: "", image_url: "" };

const AdminAchievements = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("achievements").select("*").order("category").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      toast({ title: "Category and title required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("achievements").insert({
      category: form.category.trim(),
      title: form.title.trim(),
      description: form.description || null,
      date: form.date || null,
      link: form.link || null,
      image_url: form.image_url || null,
      sort_order: items.length,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Achievement added" });
    setForm(empty); load();
  };

  const update = async (a: Achievement) => {
    const { error } = await supabase.from("achievements").update({
      category: a.category, title: a.title, description: a.description,
      date: a.date, link: a.link, image_url: a.image_url,
    }).eq("id", a.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated" });
  };

  const remove = async (id: string) => {
    await supabase.from("achievements").delete().eq("id", id);
    toast({ title: "Deleted" }); load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index], b = items[target];
    await Promise.all([
      supabase.from("achievements").update({ sort_order: b.sort_order ?? target }).eq("id", a.id),
      supabase.from("achievements").update({ sort_order: a.sort_order ?? index }).eq("id", b.id),
    ]);
    load();
  };

  const inp = "w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="space-y-4">
      <GlowCard>
        <h3 className="text-primary text-sm font-semibold mb-3 flex items-center gap-2"><Trophy className="h-4 w-4" /> Add Achievement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Category (e.g. CTF, CVE, Bug Bounty)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp} />
          <input placeholder="Title (e.g. picoCTF 2025 — Top 10)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
          <input placeholder="Date (e.g. 2025-03)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inp} />
          <input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inp} />
          <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={`${inp} sm:col-span-2`} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inp} sm:col-span-2 resize-none`} />
        </div>
        <button onClick={add} className="mt-3 inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent">
          <Plus className="h-4 w-4" /> Add
        </button>
      </GlowCard>

      {items.map((a, i) => (
        <GlowCard key={a.id}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="text-xs text-accent border border-accent/30 rounded px-2 py-0.5">{a.category}</span>
            <div className="flex gap-1">
              <button disabled={i === 0} onClick={() => move(i, -1)} className="p-1 text-dim hover:text-primary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button disabled={i === items.length - 1} onClick={() => move(i, 1)} className="p-1 text-dim hover:text-primary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => update(a)} className="p-1 text-dim hover:text-primary"><Save className="h-4 w-4" /></button>
              <button onClick={() => remove(a.id)} className="p-1 text-dim hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={a.category} onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, category: e.target.value } : x))} className={inp} />
            <input value={a.title} onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, title: e.target.value } : x))} className={inp} />
            <input value={a.date || ""} placeholder="Date" onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, date: e.target.value } : x))} className={inp} />
            <input value={a.link || ""} placeholder="Link" onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, link: e.target.value } : x))} className={inp} />
            <input value={a.image_url || ""} placeholder="Image URL" onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, image_url: e.target.value } : x))} className={`${inp} sm:col-span-2`} />
            <textarea value={a.description || ""} rows={2} onChange={(e) => setItems(items.map(x => x.id === a.id ? { ...x, description: e.target.value } : x))} className={`${inp} sm:col-span-2 resize-none`} />
          </div>
        </GlowCard>
      ))}
      {items.length === 0 && <p className="text-dim text-sm text-center py-8">No achievements yet.</p>}
    </div>
  );
};

export default AdminAchievements;

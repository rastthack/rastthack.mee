import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface Item {
  id: string;
  title: string;
  organization: string | null;
  role: string | null;
  date_text: string | null;
  description: string | null;
  sort_order: number | null;
}

const empty = { title: "", organization: "", role: "", date_text: "", description: "", sort_order: 0 };

const AdminExtracurricular = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("extracurricular").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("extracurricular").insert({ ...empty, ...editing, title: editing.title! });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { id, ...payload } = editing;
      const { error } = await supabase.from("extracurricular").update(payload).eq("id", id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Added" : "Updated" });
    setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("extracurricular").delete().eq("id", id);
    toast({ title: "Deleted" }); load();
  };

  const inp = "w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing(empty); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Activity
      </button>
      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} />
            <input placeholder="Organization" value={editing.organization || ""} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} className={inp} />
            <input placeholder="Role" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className={inp} />
            <input placeholder="Date (e.g. 2023 - Present)" value={editing.date_text || ""} onChange={(e) => setEditing({ ...editing, date_text: e.target.value })} className={inp} />
            <textarea placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className={`${inp} resize-none`} />
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm hover:text-primary transition-colors"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}
      {items.map((it) => (
        <GlowCard key={it.id}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-primary font-bold">{it.title}</h3>
              <p className="text-dim text-xs mt-0.5">{[it.role, it.organization].filter(Boolean).join(" • ")}</p>
              {it.date_text && <p className="text-primary/60 text-xs">{it.date_text}</p>}
              {it.description && <p className="text-dim text-xs mt-1">{it.description}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(it); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(it.id)} className="p-1.5 text-dim hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {items.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No activities yet.</p>}
    </div>
  );
};
export default AdminExtracurricular;

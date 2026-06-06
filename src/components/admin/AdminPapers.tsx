import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  abstract: string | null;
  link: string | null;
  sort_order: number | null;
}

const empty = { title: "", abstract: "", link: "", sort_order: 0 };

const AdminPapers = () => {
  const [items, setItems] = useState<Paper[]>([]);
  const [editing, setEditing] = useState<Partial<Paper> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("papers").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("papers").insert({ ...empty, ...editing, title: editing.title! });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { id, ...payload } = editing;
      const { error } = await supabase.from("papers").update(payload).eq("id", id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Added" : "Updated" });
    setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("papers").delete().eq("id", id);
    toast({ title: "Deleted" }); load();
  };

  const inp = "w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing(empty); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Paper
      </button>
      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} />
            <textarea placeholder="Abstract" value={editing.abstract || ""} onChange={(e) => setEditing({ ...editing, abstract: e.target.value })} rows={5} className={`${inp} resize-none`} />
            <input placeholder="Link (URL)" value={editing.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className={inp} />
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
              {it.abstract && <p className="text-dim text-xs mt-1 line-clamp-3">{it.abstract}</p>}
              {it.link && <p className="text-primary/60 text-xs mt-1 truncate">{it.link}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(it); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(it.id)} className="p-1.5 text-dim hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {items.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No papers yet.</p>}
    </div>
  );
};
export default AdminPapers;

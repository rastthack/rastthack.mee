import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Trash2, Save, X, Pencil, ArrowUp, ArrowDown } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string | null;
  date_obtained: string | null;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number | null;
}

const empty = { title: "", issuer: "", date_obtained: "", credential_url: "", image_url: "", sort_order: 0 };

const AdminCertifications = () => {
  const [items, setItems] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("certifications").insert({ ...empty, ...editing, title: editing.title! });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("certifications").update(editing).eq("id", editing.id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Certification added" : "Certification updated" }); setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("certifications").delete().eq("id", id);
    toast({ title: "Certification deleted" }); load();
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing(empty); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Certification
      </button>

      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Certification Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Issuer (e.g. CompTIA, EC-Council)" value={editing.issuer || ""} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Date Obtained (e.g. 2024-06)" value={editing.date_obtained || ""} onChange={(e) => setEditing({ ...editing, date_obtained: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Credential URL" value={editing.credential_url || ""} onChange={(e) => setEditing({ ...editing, credential_url: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Badge/Image URL" value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm hover:text-primary transition-colors"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}

      {items.map((c) => (
        <GlowCard key={c.id}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-primary font-semibold">{c.title}</h3>
              <p className="text-dim text-xs">{c.issuer} {c.date_obtained && `• ${c.date_obtained}`}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(c); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(c.id)} className="p-1.5 text-dim hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {items.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No certifications added yet.</p>}
    </div>
  );
};

export default AdminCertifications;

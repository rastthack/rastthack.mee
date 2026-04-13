import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Trash2, Save, X } from "lucide-react";

interface Skill {
  id: string;
  label: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
}

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    if (data) setSkills(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.label?.trim()) { toast({ title: "Label required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("skills").insert({ label: editing.label!, description: editing.description, icon: editing.icon, sort_order: editing.sort_order || 0 });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("skills").update(editing).eq("id", editing.id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Skill added" : "Skill updated" }); setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    toast({ title: "Skill deleted" }); load();
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing({ label: "", description: "", icon: "", sort_order: 0 }); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Skill
      </button>

      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Skill Label" value={editing.label || ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Icon name (e.g. Shield, Globe)" value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm hover:text-primary transition-colors"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}

      {skills.map((s) => (
        <GlowCard key={s.id}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-primary font-semibold">{s.label}</h3>
              <p className="text-dim text-xs">{s.description}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(s); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary transition-colors">✏️</button>
              <button onClick={() => remove(s.id)} className="p-1.5 text-dim hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {skills.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No skills added yet.</p>}
    </div>
  );
};

export default AdminSkills;

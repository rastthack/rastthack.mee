import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Pencil, Trash2, Save, X, ArrowUp, ArrowDown } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string | null;
  github_link: string | null;
  image_url: string | null;
  sort_order: number | null;
}

const emptyProject = { title: "", description: "", tech_stack: "", github_link: "", image_url: "", sort_order: 0 };

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data) setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("projects").insert({ ...emptyProject, ...editing, title: editing.title! });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("projects").update(editing).eq("id", editing.id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Project added" : "Project updated" });
    setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    toast({ title: "Project deleted" }); load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const a = projects[index], b = projects[target];
    const ao = a.sort_order ?? index, bo = b.sort_order ?? target;
    const newOrderA = ao === bo ? bo + dir : bo;
    const newOrderB = ao === bo ? ao : ao;
    const reordered = [...projects];
    reordered[index] = { ...b, sort_order: newOrderB };
    reordered[target] = { ...a, sort_order: newOrderA };
    setProjects(reordered);
    await Promise.all([
      supabase.from("projects").update({ sort_order: newOrderA }).eq("id", a.id),
      supabase.from("projects").update({ sort_order: newOrderB }).eq("id", b.id),
    ]);
    load();
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing(emptyProject); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> Add Project
      </button>

      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <textarea placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
            <input placeholder="Tech Stack (comma separated)" value={editing.tech_stack || ""} onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="GitHub Link" value={editing.github_link || ""} onChange={(e) => setEditing({ ...editing, github_link: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <input placeholder="Image URL" value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm hover:text-primary transition-colors"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}

      {projects.map((p, i) => (
        <GlowCard key={p.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-primary font-bold">{p.title}</h3>
              <p className="text-dim text-xs mt-1">{p.description}</p>
              {p.tech_stack && <p className="text-xs text-primary/60 mt-1">{p.tech_stack}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-dim hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-dim"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="p-1.5 text-dim hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-dim"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(p.id)} className="p-1.5 text-dim hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {projects.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No projects yet. Add your first one!</p>}
    </div>
  );
};

export default AdminProjects;

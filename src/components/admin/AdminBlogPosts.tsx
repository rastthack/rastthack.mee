import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  tags: string | null;
  published: boolean | null;
  created_at: string;
}

const emptyPost = { title: "", content: "", tags: "", published: false };

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert({ ...emptyPost, ...editing, title: editing.title! });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("blog_posts").update(editing).eq("id", editing.id!);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: isNew ? "Post created" : "Post updated" }); setEditing(null); setIsNew(false); load();
  };

  const remove = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Post deleted" }); load();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    load();
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { setEditing(emptyPost); setIsNew(true); }} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors">
        <Plus className="h-4 w-4" /> New Post
      </button>

      {editing && (
        <GlowCard>
          <div className="space-y-3">
            <input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <textarea placeholder="Content (Markdown supported)" value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
            <input placeholder="Tags (comma separated)" value={editing.tags || ""} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <label className="flex items-center gap-2 text-sm text-dim">
              <input type="checkbox" checked={editing.published || false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="accent-primary" /> Publish immediately
            </label>
            <div className="flex gap-2">
              <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors"><Save className="h-4 w-4" /> Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="inline-flex items-center gap-1 border border-primary/20 text-dim px-4 py-2 rounded text-sm hover:text-primary transition-colors"><X className="h-4 w-4" /> Cancel</button>
            </div>
          </div>
        </GlowCard>
      )}

      {posts.map((p) => (
        <GlowCard key={p.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-primary font-bold">{p.title}</h3>
                <span className={`text-xs px-1.5 py-0.5 rounded ${p.published ? "bg-primary/20 text-primary" : "bg-muted text-dim"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-dim text-xs mt-1">{p.tags}</p>
              <p className="text-dim text-xs mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => togglePublish(p)} className="p-1.5 text-dim hover:text-primary transition-colors" title={p.published ? "Unpublish" : "Publish"}>
                {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-1.5 text-dim hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(p.id)} className="p-1.5 text-dim hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {posts.length === 0 && !editing && <p className="text-dim text-sm text-center py-8">No blog posts yet.</p>}
    </div>
  );
};

export default AdminBlogPosts;

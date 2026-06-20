import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Plus, Trash2, Save, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
  sort_order: number;
}

const PLATFORMS = ["GitHub", "LinkedIn", "X", "Facebook", "Reddit", "Instagram", "YouTube", "Mastodon", "Discord", "Telegram", "Email", "Website", "Other"];

const AdminSocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [platform, setPlatform] = useState("GitHub");
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("social_links").select("*").order("sort_order");
    if (data) setLinks(data as SocialLink[]);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!url.trim()) { toast({ title: "URL required", variant: "destructive" }); return; }
    const { error } = await supabase.from("social_links").insert({ platform, url: url.trim(), sort_order: links.length });
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setUrl("");
    toast({ title: "Added" });
    load();
  };

  const update = async (id: string, patch: Partial<SocialLink>) => {
    const { error } = await supabase.from("social_links").update(patch).eq("id", id);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("social_links").delete().eq("id", id);
    load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= links.length) return;
    const a = links[idx], b = links[j];
    await supabase.from("social_links").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("social_links").update({ sort_order: a.sort_order }).eq("id", b.id);
    load();
  };

  return (
    <GlowCard>
      <h3 className="text-primary font-bold mb-4">Social Links</h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-terminal border border-primary/20 rounded px-3 py-2 text-sm">
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-terminal border border-primary/20 rounded px-3 py-2 text-sm" />
        <button onClick={add} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-accent">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={l.id} className="flex flex-wrap items-center gap-2 border border-primary/10 rounded p-2">
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-dim hover:text-primary disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
              <button onClick={() => move(i, 1)} disabled={i === links.length - 1} className="text-dim hover:text-primary disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
            </div>
            <select value={l.platform} onChange={(e) => update(l.id, { platform: e.target.value })} className="bg-terminal border border-primary/20 rounded px-2 py-1 text-xs">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input defaultValue={l.url} onBlur={(e) => e.target.value !== l.url && update(l.id, { url: e.target.value })} className="flex-1 min-w-[200px] bg-terminal border border-primary/20 rounded px-2 py-1 text-xs" />
            <button onClick={() => update(l.id, { visible: !l.visible })} title={l.visible ? "Public" : "Private"} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${l.visible ? "text-primary" : "text-dim"}`}>
              {l.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {l.visible ? "Public" : "Private"}
            </button>
            <button onClick={() => remove(l.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {links.length === 0 && <p className="text-dim text-sm">No social links yet.</p>}
      </div>
    </GlowCard>
  );
};

export default AdminSocialLinks;

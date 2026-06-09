import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Save } from "lucide-react";

const AdminAbout = () => {
  const [bio, setBio] = useState("");
  const [id, setId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("about_info").select("*").limit(1).single();
      if (data) { setBio(data.bio || ""); setId(data.id); }
    };
    load();
  }, []);

  const save = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast({ title: "Not signed in", description: "Please sign in again.", variant: "destructive" });
      return;
    }
    if (id) {
      const { data, error } = await supabase
        .from("about_info")
        .update({ bio, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
      if (!data || data.length === 0) {
        toast({ title: "Save failed", description: "No rows updated. Check admin permissions.", variant: "destructive" });
        return;
      }
    } else {
      const { data, error } = await supabase.from("about_info").insert({ bio }).select().single();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
      if (data) setId(data.id);
    }
    toast({ title: "About info updated" });
  };

  return (
    <GlowCard>
      <h3 className="text-primary font-bold mb-4">About / Bio</h3>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={10}
        className="w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none mb-4"
        placeholder="Write your bio here..."
      />
      <button onClick={save} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent transition-colors">
        <Save className="h-4 w-4" /> Save
      </button>
    </GlowCard>
  );
};

export default AdminAbout;

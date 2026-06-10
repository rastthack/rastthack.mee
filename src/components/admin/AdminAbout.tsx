import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Save, Upload, Trash2 } from "lucide-react";

const AdminAbout = () => {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("about_info").select("*").limit(1).maybeSingle();
      if (data) { setBio(data.bio || ""); setAvatarUrl(data.avatar_url || null); setId(data.id); }
    };
    load();
  }, []);

  const save = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast({ title: "Not signed in", variant: "destructive" });
      return;
    }
    if (id) {
      const { data, error } = await supabase
        .from("about_info")
        .update({ bio, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
      if (!data || data.length === 0) {
        toast({ title: "Save failed", description: "No rows updated.", variant: "destructive" });
        return;
      }
    } else {
      const { data, error } = await supabase.from("about_info").insert({ bio, avatar_url: avatarUrl }).select().single();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
      if (data) setId(data.id);
    }
    toast({ title: "About info updated" });
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Image files only", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Max 5MB", variant: "destructive" }); return; }
    setUploading(true);
    const path = `profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setUploading(false); return; }
    const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    const url = signed?.signedUrl || "";
    setAvatarUrl(url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: "Avatar uploaded — click Save to apply" });
  };

  return (
    <GlowCard>
      <h3 className="text-primary font-bold mb-4">About / Bio</h3>

      <div className="mb-6">
        <label className="text-xs text-dim block mb-2">Profile Picture</label>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border border-primary/30" />
          ) : (
            <div className="w-20 h-20 rounded-full border border-primary/20 bg-terminal flex items-center justify-center text-dim text-xs">None</div>
          )}
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading}
              className="block text-xs text-dim file:mr-3 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:font-semibold file:cursor-pointer disabled:opacity-50" />
            {avatarUrl && (
              <button onClick={() => setAvatarUrl(null)} className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 w-fit">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
            {uploading && <p className="text-primary text-xs animate-glow-pulse"><Upload className="h-3 w-3 inline" /> Uploading...</p>}
          </div>
        </div>
      </div>

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

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Upload, Trash2, FileText, Eye, EyeOff } from "lucide-react";

interface CV {
  id: string;
  title: string;
  file_url: string;
  file_path: string | null;
  is_active: boolean;
  sort_order: number | null;
}

const AdminCV = () => {
  const [items, setItems] = useState<CV[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("cv_resumes").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) { toast({ title: "Enter a title first", variant: "destructive" }); return; }
    if (file.type !== "application/pdf") { toast({ title: "PDF only", variant: "destructive" }); return; }
    if (file.size > 10 * 1024 * 1024) { toast({ title: "Max 10MB", variant: "destructive" }); return; }

    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("cv-files").upload(path, file, { contentType: "application/pdf" });
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setUploading(false); return; }

    const { data: signed } = await supabase.storage.from("cv-files").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    const url = signed?.signedUrl || "";

    const { error } = await supabase.from("cv_resumes").insert({ title: title.trim(), file_url: url, file_path: path, is_active: true });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setUploading(false); return; }

    toast({ title: "CV uploaded" });
    setTitle(""); if (fileRef.current) fileRef.current.value = ""; setUploading(false); load();
  };

  const toggleActive = async (cv: CV) => {
    await supabase.from("cv_resumes").update({ is_active: !cv.is_active }).eq("id", cv.id);
    load();
  };

  const remove = async (cv: CV) => {
    if (cv.file_path) await supabase.storage.from("cv-files").remove([cv.file_path]);
    await supabase.from("cv_resumes").delete().eq("id", cv.id);
    toast({ title: "Deleted" }); load();
  };

  const inp = "w-full bg-terminal border border-primary/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50";

  return (
    <div className="space-y-4">
      <GlowCard>
        <h3 className="text-primary text-sm font-semibold mb-3">Upload New CV / Resume (PDF, max 10MB)</h3>
        <div className="space-y-3">
          <input placeholder="Title (e.g. Resume 2026)" value={title} onChange={(e) => setTitle(e.target.value)} className={inp} />
          <input ref={fileRef} type="file" accept="application/pdf" onChange={upload} disabled={uploading} className="block text-xs text-dim file:mr-3 file:px-3 file:py-1.5 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:font-semibold file:cursor-pointer disabled:opacity-50" />
          {uploading && <p className="text-primary text-xs animate-glow-pulse">Uploading...</p>}
        </div>
      </GlowCard>

      {items.map((cv) => (
        <GlowCard key={cv.id}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="text-primary font-bold">{cv.title}</h3>
                <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className="text-primary/60 text-xs hover:text-accent">View PDF</a>
                <p className="text-dim/60 text-xs mt-0.5">{cv.is_active ? "Visible to visitors" : "Hidden"}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleActive(cv)} className="p-1.5 text-dim hover:text-primary" title={cv.is_active ? "Hide" : "Show"}>
                {cv.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => remove(cv)} className="p-1.5 text-dim hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </GlowCard>
      ))}
      {items.length === 0 && <p className="text-dim text-sm text-center py-8">No CVs uploaded.</p>}
    </div>
  );
};
export default AdminCV;

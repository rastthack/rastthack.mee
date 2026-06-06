import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlowCard from "@/components/GlowCard";
import { Eye, EyeOff } from "lucide-react";

const BUILTIN = [
  { key: "extracurricular", label: "Extracurricular" },
  { key: "cv", label: "CV / Resumes" },
  { key: "papers", label: "Papers / Research" },
];

interface Row { section_key: string; visible: boolean; }

const AdminVisibility = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("section_visibility").select("*");
    if (data) setRows(data);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (key: string, current: boolean) => {
    await supabase.from("section_visibility").upsert({ section_key: key, visible: !current }, { onConflict: "section_key" });
    toast({ title: !current ? "Section shown" : "Section hidden" });
    load();
  };

  const isVisible = (key: string) => rows.find((r) => r.section_key === key)?.visible ?? true;

  return (
    <div className="space-y-4">
      <p className="text-dim text-xs">Show or hide built-in sections on the public site. Custom sections have their own toggle inside the Custom Sections tab.</p>
      {BUILTIN.map((s) => {
        const v = isVisible(s.key);
        return (
          <GlowCard key={s.key}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary font-semibold">{s.label}</h3>
                <p className="text-dim/60 text-xs">{v ? "Currently visible to visitors" : "Hidden from visitors"}</p>
              </div>
              <button onClick={() => toggle(s.key, v)} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${v ? "bg-primary/10 text-primary border border-primary/30" : "bg-destructive/10 text-destructive border border-destructive/30"}`}>
                {v ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
              </button>
            </div>
          </GlowCard>
        );
      })}
    </div>
  );
};
export default AdminVisibility;

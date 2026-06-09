import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Users } from "lucide-react";

interface Extra {
  id: string; title: string; organization: string | null; role: string | null;
  date_text: string | null; description: string | null;
}

const ExtracurricularPage = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("extracurricular").select("*").order("sort_order").then(({ data }) => {
      if (data) setExtras(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Extracurricular" subtitle="Activities, communities, and contributions" />
        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading...</p>
        ) : extras.length === 0 ? (
          <p className="text-dim text-center">No activities yet.</p>
        ) : (
          <div className="space-y-4">
            {extras.map((e) => (
              <GlowCard key={e.id}>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h3 className="text-primary font-semibold">{e.title}</h3>
                    <p className="text-dim text-xs">{[e.role, e.organization].filter(Boolean).join(" • ")}</p>
                    {e.date_text && <p className="text-primary/60 text-xs">{e.date_text}</p>}
                    {e.description && <p className="text-dim text-sm mt-2 whitespace-pre-wrap">{e.description}</p>}
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtracurricularPage;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { BookOpen, ExternalLink } from "lucide-react";

interface Paper { id: string; title: string; abstract: string | null; link: string | null; }

const PapersPage = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("papers").select("*").order("sort_order").then(({ data }) => {
      if (data) setPapers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Papers & Research" subtitle="Published work and research contributions" />
        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading...</p>
        ) : papers.length === 0 ? (
          <p className="text-dim text-center">No papers yet.</p>
        ) : (
          <div className="space-y-4">
            {papers.map((p) => (
              <GlowCard key={p.id}>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-primary font-semibold">{p.title}</h3>
                    {p.abstract && <p className="text-dim text-sm mt-2 whitespace-pre-wrap">{p.abstract}</p>}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent mt-2">
                        Read paper <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
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

export default PapersPage;

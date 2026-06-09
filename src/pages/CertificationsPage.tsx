import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Award, ExternalLink } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";

interface Certification {
  id: string; title: string; issuer: string | null; date_obtained: string | null;
  credential_url: string | null; image_url: string | null;
}

const CertificationsPage = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("certifications").select("*").order("sort_order").then(({ data }) => {
      if (data) setCerts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeading title="Certifications" subtitle="Professional credentials and achievements" />
        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading...</p>
        ) : certs.length === 0 ? (
          <p className="text-dim text-center">No certifications yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certs.map((c) => (
              <GlowCard key={c.id} className="flex items-start gap-4">
                {c.image_url ? (
                  <img
                    src={toDirectImageUrl(c.image_url)}
                    alt={c.title}
                    className="w-20 h-20 rounded object-contain bg-terminal flex-shrink-0"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-primary font-semibold text-sm">{c.title}</h3>
                  {c.issuer && <p className="text-dim text-xs mt-0.5">{c.issuer}</p>}
                  {c.date_obtained && <p className="text-dim/60 text-xs mt-0.5">{c.date_obtained}</p>}
                  {c.credential_url && (
                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors mt-2">
                      Verify <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsPage;

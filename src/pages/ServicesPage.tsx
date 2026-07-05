import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Shield, Globe, Search, Brain, Code, Lock, Server, Bug, Terminal } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Shield, Globe, Search, Brain, Code, Lock, Server, Bug, Terminal };

interface Service { id: string; title: string; description: string | null; icon: string | null; }

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeading title="Services" subtitle="Security services I deliver" />
        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-dim text-center">No services added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => {
              const Icon = iconMap[s.icon || "Shield"] || Shield;
              return (
                <GlowCard key={s.id} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-primary font-semibold mb-2">{s.title}</h3>
                  <p className="text-dim text-xs whitespace-pre-wrap">{s.description}</p>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;

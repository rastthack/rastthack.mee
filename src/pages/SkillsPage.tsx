import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Shield, Globe, Search, Brain, Code, Lock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Shield, Globe, Search, Brain, Code, Lock };

interface Skill { id: string; label: string; description: string | null; icon: string | null; }

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("skills").select("*").order("sort_order").then(({ data }) => {
      if (data) setSkills(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeading title="Skills" subtitle="Core competencies and areas of expertise" />
        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading...</p>
        ) : skills.length === 0 ? (
          <p className="text-dim text-center">No skills added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => {
              const Icon = iconMap[skill.icon || "Shield"] || Shield;
              return (
                <GlowCard key={skill.id} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-primary font-semibold mb-1">{skill.label}</h3>
                  <p className="text-dim text-xs">{skill.description}</p>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;

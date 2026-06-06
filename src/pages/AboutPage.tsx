import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Shield, Globe, Search, Brain, Code, Lock, Award, ExternalLink, Users, FileDown, BookOpen, FileText } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Shield, Globe, Search, Brain, Code, Lock,
};

interface Skill { id: string; label: string; description: string | null; icon: string | null; sort_order: number | null; }
interface Certification { id: string; title: string; issuer: string | null; date_obtained: string | null; credential_url: string | null; image_url: string | null; }
interface Extra { id: string; title: string; organization: string | null; role: string | null; date_text: string | null; description: string | null; }
interface CV { id: string; title: string; file_url: string; }
interface Paper { id: string; title: string; abstract: string | null; link: string | null; }
interface CustomSection { id: string; title: string; slug: string; description: string | null; sort_order: number | null; }
interface CustomItem { id: string; section_id: string; title: string; content: string | null; image_url: string | null; link: string | null; }

const AboutPage = () => {
  const [bio, setBio] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const [aboutRes, skillsRes, certsRes, extraRes, cvRes, papersRes, csRes, ciRes, visRes] = await Promise.all([
        supabase.from("about_info").select("*").limit(1).maybeSingle(),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("certifications").select("*").order("sort_order"),
        supabase.from("extracurricular").select("*").order("sort_order"),
        supabase.from("cv_resumes").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("papers").select("*").order("sort_order"),
        supabase.from("custom_sections").select("*").eq("visible", true).order("sort_order"),
        supabase.from("custom_section_items").select("*").order("sort_order"),
        supabase.from("section_visibility").select("*"),
      ]);
      if (aboutRes.data) setBio(aboutRes.data.bio);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (certsRes.data) setCertifications(certsRes.data);
      if (extraRes.data) setExtras(extraRes.data);
      if (cvRes.data) setCvs(cvRes.data);
      if (papersRes.data) setPapers(papersRes.data);
      if (csRes.data) setCustomSections(csRes.data);
      if (ciRes.data) setCustomItems(ciRes.data);
      if (visRes.data) {
        const map: Record<string, boolean> = {};
        visRes.data.forEach((r: { section_key: string; visible: boolean }) => { map[r.section_key] = r.visible; });
        setVisibility(map);
      }
    };
    load();
  }, []);

  const show = (key: string) => visibility[key] ?? true;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="About Me" subtitle="Security researcher dedicated to making the digital world safer" />

        <GlowCard className="mb-12">
          <div className="space-y-4 text-dim leading-relaxed whitespace-pre-wrap">
            {bio ? <p>{bio}</p> : <p className="animate-glow-pulse">Loading...</p>}
          </div>
        </GlowCard>

        <SectionHeading title="Skills" subtitle="Core competencies and areas of expertise" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {skills.map((skill) => {
            const IconComponent = iconMap[skill.icon || "Shield"] || Shield;
            return (
              <GlowCard key={skill.id} className="text-center">
                <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="text-primary font-semibold mb-1">{skill.label}</h3>
                <p className="text-dim text-xs">{skill.description}</p>
              </GlowCard>
            );
          })}
        </div>

        <SectionHeading title="Certifications" subtitle="Professional credentials and achievements" />
        {certifications.length === 0 ? (
          <p className="text-dim text-center text-sm mb-16">Certifications coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {certifications.map((cert) => (
              <GlowCard key={cert.id} className="flex items-start gap-4">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.title} className="w-16 h-16 rounded object-contain flex-shrink-0" loading="lazy" />
                ) : (
                  <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-primary font-semibold text-sm">{cert.title}</h3>
                  {cert.issuer && <p className="text-dim text-xs">{cert.issuer}</p>}
                  {cert.date_obtained && <p className="text-dim/50 text-xs mt-0.5">{cert.date_obtained}</p>}
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors mt-1">
                      Verify <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </GlowCard>
            ))}
          </div>
        )}

        {show("extracurricular") && extras.length > 0 && (
          <>
            <SectionHeading title="Extracurricular" subtitle="Activities, communities, and contributions" />
            <div className="space-y-4 mb-16">
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
          </>
        )}

        {show("cv") && cvs.length > 0 && (
          <>
            <SectionHeading title="CV / Resume" subtitle="View or download my current resume" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
              {cvs.map((cv) => (
                <GlowCard key={cv.id}>
                  <div className="flex items-center gap-3">
                    <FileDown className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-primary font-semibold truncate">{cv.title}</h3>
                      <div className="flex gap-3 mt-2">
                        <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href={cv.file_url} download className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent">
                          Download <FileDown className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </>
        )}

        {show("papers") && papers.length > 0 && (
          <>
            <SectionHeading title="Papers & Research" subtitle="Published work and research contributions" />
            <div className="space-y-4 mb-16">
              {papers.map((p) => (
                <GlowCard key={p.id}>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-primary font-semibold">{p.title}</h3>
                      {p.abstract && <p className="text-dim text-sm mt-2 whitespace-pre-wrap">{p.abstract}</p>}
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent mt-2">
                          Read paper <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </>
        )}

        {customSections.map((s) => {
          const itemsForSection = customItems.filter((i) => i.section_id === s.id);
          if (itemsForSection.length === 0) return null;
          return (
            <div key={s.id}>
              <SectionHeading title={s.title} subtitle={s.description || undefined} />
              <div className="space-y-4 mb-16">
                {itemsForSection.map((it) => (
                  <GlowCard key={it.id}>
                    <div className="flex items-start gap-3">
                      {it.image_url ? (
                        <img src={it.image_url} alt={it.title} className="w-16 h-16 rounded object-cover flex-shrink-0" loading="lazy" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-primary font-semibold">{it.title}</h3>
                        {it.content && <p className="text-dim text-sm mt-2 whitespace-pre-wrap">{it.content}</p>}
                        {it.link && (
                          <a href={it.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent mt-2">
                            Open <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutPage;

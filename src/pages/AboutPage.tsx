import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { FileDown, ExternalLink, FileText, Github, Linkedin, Twitter, Facebook, Youtube, Instagram, Mail, Globe, MessageCircle, Send } from "lucide-react";

interface CV { id: string; title: string; file_url: string; }
interface CustomSection { id: string; title: string; slug: string; description: string | null; sort_order: number | null; }
interface CustomItem { id: string; section_id: string; title: string; content: string | null; image_url: string | null; link: string | null; }
interface Achievement { id: string; category: string; title: string; description: string | null; date: string | null; link: string | null; image_url: string | null; sort_order: number | null; }
interface SocialLink { id: string; platform: string; url: string; visible: boolean; sort_order: number; }

const SOCIAL_ICONS: Record<string, typeof Github> = {
  GitHub: Github, LinkedIn: Linkedin, X: Twitter, Twitter: Twitter, Facebook: Facebook,
  Reddit: MessageCircle, Instagram: Instagram, YouTube: Youtube, Mastodon: MessageCircle,
  Discord: MessageCircle, Telegram: Send, Email: Mail, Website: Globe, Other: Globe,
};

const AboutPage = () => {
  const [bio, setBio] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const [aboutRes, cvRes, csRes, ciRes, visRes, achRes, socRes] = await Promise.all([
        supabase.from("about_info").select("*").limit(1).maybeSingle(),
        supabase.from("cv_resumes").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("custom_sections").select("*").eq("visible", true).order("sort_order"),
        supabase.from("custom_section_items").select("*").order("sort_order"),
        supabase.from("section_visibility").select("*"),
        supabase.from("achievements").select("*").order("category").order("sort_order"),
        (supabase as any).from("social_links").select("*").eq("visible", true).order("sort_order"),
      ]);
      if (aboutRes.data) { setBio(aboutRes.data.bio); setAvatarUrl(aboutRes.data.avatar_url); }
      if (cvRes.data) setCvs(cvRes.data);
      if (csRes.data) setCustomSections(csRes.data);
      if (ciRes.data) setCustomItems(ciRes.data);
      if (achRes.data) setAchievements(achRes.data);
      if (socRes.data) setSocials(socRes.data as SocialLink[]);
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
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {avatarUrl && (
              <img src={avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-primary/40 flex-shrink-0 glow-border" loading="lazy" />
            )}
            <div className="flex-1 space-y-4">
              <div className="space-y-4 text-dim leading-relaxed whitespace-pre-wrap">
                {bio ? <p>{bio}</p> : <p className="animate-glow-pulse">Loading...</p>}
              </div>
              {socials.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.platform] || Globe;
                    return (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/30 text-xs text-primary hover:bg-primary/10 hover:border-primary transition-colors"
                        title={s.platform}>
                        <Icon className="h-3.5 w-3.5" />
                        {s.platform}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </GlowCard>

        {achievements.length > 0 && (
          <>
            <SectionHeading title="Achievements" subtitle="CTFs, CVEs, and notable wins" />
            <div className="space-y-8 mb-16">
              {Array.from(new Set(achievements.map(a => a.category))).map((cat) => {
                const list = achievements.filter(a => a.category === cat);
                return (
                  <div key={cat}>
                    <h3 className="text-accent text-sm font-bold tracking-wider mb-3 uppercase">// {cat}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {list.map((a) => (
                        <GlowCard key={a.id}>
                          <div className="flex items-start gap-3">
                            {a.image_url && (
                              <img src={a.image_url} alt={a.title} className="w-14 h-14 rounded object-cover flex-shrink-0" loading="lazy" />
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-primary font-semibold">{a.title}</h4>
                              {a.date && <p className="text-dim/70 text-xs mt-0.5">{a.date}</p>}
                              {a.description && <p className="text-dim text-sm mt-2 whitespace-pre-wrap">{a.description}</p>}
                              {a.link && (
                                <a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent mt-2">
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

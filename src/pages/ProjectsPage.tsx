import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { ExternalLink, Github, X, ChevronRight } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string | null;
  github_link: string | null;
  image_url: string | null;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      if (data) setProjects(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Projects" subtitle="Tools and research projects in cybersecurity — click any project to view full details" />

        {loading ? (
          <p className="text-dim text-center animate-glow-pulse">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-dim text-center">Projects coming soon.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => setSelected(project)}
                  className="w-full text-left bg-card border border-primary/10 rounded-lg p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 glow-border hover:glow-border-hover flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-primary font-bold text-base md:text-lg truncate">{project.title}</h3>
                    {project.tech_stack && (
                      <p className="text-dim text-xs mt-1 truncate">{project.tech_stack}</p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-card border border-primary/30 rounded-lg w-full max-w-3xl my-8 glow-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-3 right-3 p-2 rounded text-dim hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary glow-text mb-4 pr-10">{selected.title}</h2>

              {selected.image_url && (
                <img
                  src={toDirectImageUrl(selected.image_url)}
                  alt={selected.title}
                  className="rounded mb-6 w-full max-h-96 object-contain bg-terminal border border-primary/10"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}

              {selected.tech_stack && (
                <div className="mb-5">
                  <p className="text-xs text-dim uppercase tracking-wider mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tech_stack.split(",").map((tech) => (
                      <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.description && (
                <div className="mb-6">
                  <p className="text-xs text-dim uppercase tracking-wider mb-2">Description</p>
                  <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.description}
                  </p>
                </div>
              )}

              {selected.github_link && (
                <a
                  href={selected.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors"
                >
                  <Github className="h-4 w-4" /> View Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

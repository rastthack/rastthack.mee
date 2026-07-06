import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { toDirectImageUrl } from "@/lib/driveUrl";
import { idFromSlug, postSlug } from "@/lib/slug";

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string | null;
  github_link: string | null;
  image_url: string | null;
}

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      const idSuffix = slug ? idFromSlug(slug) : null;
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      const projects = (data || []) as Project[];
      let found: Project | undefined;
      if (idSuffix) found = projects.find((p) => p.id.startsWith(idSuffix));
      if (!found && slug) found = projects.find((p) => postSlug(p.title, p.id) === slug);
      if (found) {
        setProject(found);
        document.title = `${found.title} — Projects`;
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <p className="text-dim text-center animate-glow-pulse">Loading project...</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen pt-24 pb-16 container mx-auto px-4 max-w-3xl text-center">
        <p className="text-dim mb-4">Project not found.</p>
        <Link to="/projects" className="text-primary hover:text-accent inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/projects" className="text-dim hover:text-primary inline-flex items-center gap-1 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-primary glow-text mb-4">{project.title}</h1>

        {project.image_url && (
          <img
            src={toDirectImageUrl(project.image_url)}
            alt={project.title}
            className="rounded mb-6 w-full max-h-96 object-contain bg-terminal border border-primary/10"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}

        {project.tech_stack && (
          <div className="mb-5">
            <p className="text-xs text-dim uppercase tracking-wider mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.split(",").map((tech) => (
                <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.description && (
          <div className="mb-6">
            <p className="text-xs text-dim uppercase tracking-wider mb-2">Description</p>
            <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        )}

        {project.github_link && (
          <a
            href={project.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-accent transition-colors"
          >
            <Github className="h-4 w-4" /> View Source <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;

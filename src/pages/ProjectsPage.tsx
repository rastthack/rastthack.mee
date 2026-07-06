import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import { ChevronRight } from "lucide-react";
import { postSlug } from "@/lib/slug";

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

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      if (data) setProjects(data);
      setLoading(false);
    };
    load();
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
                <Link
                  to={`/projects/${postSlug(project.title, project.id)}`}
                  className="w-full text-left bg-card border border-primary/10 rounded-lg p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 glow-border hover:glow-border-hover flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-primary font-bold text-base md:text-lg truncate">{project.title}</h3>
                    {project.tech_stack && (
                      <p className="text-dim text-xs mt-1 truncate">{project.tech_stack}</p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

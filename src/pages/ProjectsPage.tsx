import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { ExternalLink, Github } from "lucide-react";

// Static placeholder data — will be replaced with database later
const projects = [
  {
    id: "1",
    title: "VulnScanner Pro",
    description: "Automated vulnerability scanner for web applications with custom payload generation.",
    tech_stack: "Python, Burp Suite, SQLMap",
    github_link: "https://github.com/rastthack",
    image_url: null,
  },
  {
    id: "2",
    title: "OSINT Framework",
    description: "Open-source intelligence gathering toolkit for security researchers.",
    tech_stack: "Python, Shodan API, Maltego",
    github_link: "https://github.com/rastthack",
    image_url: null,
  },
  {
    id: "3",
    title: "Network Fortress",
    description: "Automated network hardening and monitoring suite for enterprise environments.",
    tech_stack: "Bash, Nmap, Wireshark",
    github_link: "https://github.com/rastthack",
    image_url: null,
  },
];

const ProjectsPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <SectionHeading
          title="Projects"
          subtitle="Tools and research projects in cybersecurity"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <GlowCard key={project.id} className="flex flex-col">
              {project.image_url && (
                <img src={project.image_url} alt={project.title} className="rounded mb-4 w-full h-40 object-cover" />
              )}
              <h3 className="text-primary font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-dim text-sm flex-1 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tech_stack.split(",").map((tech) => (
                  <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {tech.trim()}
                  </span>
                ))}
              </div>
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors"
                >
                  <Github className="h-4 w-4" />
                  View Source
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

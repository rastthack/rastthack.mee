import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Shield, Globe, Search, Brain, Code, Lock, Award, ExternalLink } from "lucide-react";

const defaultSkills = [
  { icon: Shield, label: "Cybersecurity", desc: "Vulnerability assessment & defense strategies" },
  { icon: Globe, label: "Web Pentesting", desc: "OWASP Top 10, API security testing" },
  { icon: Search, label: "OSINT", desc: "Open-source intelligence gathering" },
  { icon: Brain, label: "AI Security", desc: "Adversarial ML & AI system hardening" },
  { icon: Code, label: "Exploit Development", desc: "Custom exploit research & PoC creation" },
  { icon: Lock, label: "Network Security", desc: "Infrastructure & network penetration testing" },
];

interface Certification {
  id: string;
  title: string;
  issuer: string | null;
  date_obtained: string | null;
  credential_url: string | null;
  image_url: string | null;
}

const AboutPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("certifications").select("*").order("sort_order");
      if (data) setCertifications(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading
          title="About Me"
          subtitle="Security researcher dedicated to making the digital world safer"
        />

        <GlowCard className="mb-12">
          <div className="space-y-4 text-dim leading-relaxed">
            <p>
              Hi, I'm <span className="text-primary font-semibold">Raduan Ahamed</span> — an ethical hacker and penetration tester passionate about uncovering vulnerabilities before the bad actors do.
            </p>
            <p>
              I specialize in web application security, OSINT, and AI security research. Through CTF competitions and real-world engagements, I continuously sharpen my offensive security skills while contributing to the community through writeups and open-source tools.
            </p>
            <p>
              My mission is simple: <span className="text-primary italic">break systems to secure them.</span>
            </p>
          </div>
        </GlowCard>

        <SectionHeading title="Skills" subtitle="Core competencies and areas of expertise" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {defaultSkills.map((skill) => (
            <GlowCard key={skill.label} className="text-center">
              <skill.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-primary font-semibold mb-1">{skill.label}</h3>
              <p className="text-dim text-xs">{skill.desc}</p>
            </GlowCard>
          ))}
        </div>

        {/* Certifications Section */}
        <SectionHeading title="Certifications" subtitle="Professional credentials and achievements" />

        {certifications.length === 0 ? (
          <p className="text-dim text-center text-sm">Certifications coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default AboutPage;

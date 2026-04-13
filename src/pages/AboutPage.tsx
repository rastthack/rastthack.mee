import SectionHeading from "@/components/SectionHeading";
import GlowCard from "@/components/GlowCard";
import { Shield, Globe, Search, Brain, Code, Lock } from "lucide-react";

const skills = [
  { icon: Shield, label: "Cybersecurity", desc: "Vulnerability assessment & defense strategies" },
  { icon: Globe, label: "Web Pentesting", desc: "OWASP Top 10, API security testing" },
  { icon: Search, label: "OSINT", desc: "Open-source intelligence gathering" },
  { icon: Brain, label: "AI Security", desc: "Adversarial ML & AI system hardening" },
  { icon: Code, label: "Exploit Development", desc: "Custom exploit research & PoC creation" },
  { icon: Lock, label: "Network Security", desc: "Infrastructure & network penetration testing" },
];

const AboutPage = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <GlowCard key={skill.label} className="text-center">
              <skill.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-primary font-semibold mb-1">{skill.label}</h3>
              <p className="text-dim text-xs">{skill.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

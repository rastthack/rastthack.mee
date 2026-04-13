import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Eye } from "lucide-react";
import TypingText from "@/components/TypingText";
import MatrixRain from "@/components/MatrixRain";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <MatrixRain />
      <div className="scanline fixed inset-0 pointer-events-none z-[1]" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Terminal window */}
          <div className="bg-terminal border border-primary/20 rounded-lg overflow-hidden glow-border mx-auto max-w-2xl">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/10 bg-primary/5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/40" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <span className="text-xs text-dim ml-2">rastthack@terminal</span>
            </div>
            <div className="p-6 text-left">
              <TypingText
                lines={[
                  "Initializing RASTTHACK...",
                  "Loading security modules...",
                  "Access Granted.",
                  "Welcome, Raduan Ahamed.",
                ]}
                typingSpeed={40}
                lineDelay={600}
                className="text-sm md:text-base leading-relaxed"
              />
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "3s" }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider glow-text">
              RASTTHACK
            </h1>
            <p className="text-dim text-lg">
              Ethical Hacker &bull; Penetration Tester &bull; Security Researcher
            </p>
            <p className="text-sm text-dim italic">
              "Breaking systems to secure them."
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "3.5s" }}>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-semibold tracking-wide hover:bg-accent transition-colors glow-border"
            >
              <Eye className="h-4 w-4" />
              View Projects
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-primary/30 text-primary px-6 py-3 rounded font-semibold tracking-wide hover:bg-primary/10 transition-colors"
            >
              <Terminal className="h-4 w-4" />
              Contact Me
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

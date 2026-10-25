import { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const GlowCard = ({ children, className = "", delay = 0 }: GlowCardProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-b from-card to-terminal p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-0.5 glow-border hover:glow-border-hover ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
};

export default GlowCard;

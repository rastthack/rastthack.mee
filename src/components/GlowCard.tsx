import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

const GlowCard = ({ children, className = "" }: GlowCardProps) => (
  <div
    className={`relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-b from-card to-terminal p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-0.5 glow-border hover:glow-border-hover ${className}`}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
    {children}
  </div>
);

export default GlowCard;

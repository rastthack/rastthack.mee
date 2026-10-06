import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

const GlowCard = ({ children, className = "" }: GlowCardProps) => (
  <div
    className={`bg-card/80 border border-primary/20 rounded-lg p-6 transition-all duration-300 hover:border-accent/50 glow-border hover:glow-border-hover ${className}`}
  >
    {children}
  </div>
);

export default GlowCard;

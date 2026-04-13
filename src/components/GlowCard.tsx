import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

const GlowCard = ({ children, className = "" }: GlowCardProps) => (
  <div
    className={`bg-card border border-primary/10 rounded-lg p-6 transition-all duration-300 hover:border-primary/30 glow-border hover:glow-border-hover ${className}`}
  >
    {children}
  </div>
);

export default GlowCard;

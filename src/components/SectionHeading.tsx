import { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`mb-12 text-center transition-all duration-700 ease-out will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <h2 className="text-3xl md:text-5xl font-bold text-primary glow-text mb-3 uppercase">
        {title}
      </h2>
      <div
        className={`mx-auto mb-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-1000 ease-out ${
          inView ? "w-24 opacity-100" : "w-0 opacity-0"
        }`}
        aria-hidden="true"
      />
      {subtitle && <p className="text-dim text-xs md:text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;

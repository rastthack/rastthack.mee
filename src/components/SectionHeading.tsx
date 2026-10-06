interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl md:text-5xl font-bold text-primary glow-text mb-3 uppercase">
      {title}
    </h2>
    {subtitle && <p className="text-dim text-xs md:text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

export default SectionHeading;

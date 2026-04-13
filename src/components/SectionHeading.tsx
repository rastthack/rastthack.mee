interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl md:text-4xl font-bold tracking-wider glow-text mb-3">
      {`// ${title}`}
    </h2>
    {subtitle && <p className="text-dim text-sm max-w-lg mx-auto">{subtitle}</p>}
  </div>
);

export default SectionHeading;

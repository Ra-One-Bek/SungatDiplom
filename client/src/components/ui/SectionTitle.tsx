interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
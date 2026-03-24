import Card from '../ui/Card';

interface ClubStatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export default function ClubStatCard({
  title,
  value,
  description,
}: ClubStatCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
    </Card>
  );
}
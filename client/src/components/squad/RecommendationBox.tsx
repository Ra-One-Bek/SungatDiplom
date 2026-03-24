import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface RecommendationBoxProps {
  title: string;
  message: string;
  level: 'good' | 'warning' | 'bad';
}

export default function RecommendationBox({
  title,
  message,
  level,
}: RecommendationBoxProps) {
  const badgeVariant =
    level === 'good' ? 'success' : level === 'warning' ? 'warning' : 'danger';

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <Badge
          text={
            level === 'good'
              ? 'Хорошо'
              : level === 'warning'
              ? 'Средне'
              : 'Плохо'
          }
          variant={badgeVariant}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
    </Card>
  );
}
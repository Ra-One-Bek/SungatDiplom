import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface PlayerCardProps {
  name: string;
  number: number;
  position: string;
  nationality: string;
  form: number;
  image?: string;
}

function getFormVariant(form: number): 'success' | 'warning' | 'danger' {
  if (form >= 80) return 'success';
  if (form >= 60) return 'warning';
  return 'danger';
}

export default function PlayerCard({
  name,
  number,
  position,
  nationality,
  form,
  image,
}: PlayerCardProps) {
  return (
    <Card className="hover:border-red-500/40 transition">
      <div className="flex items-center gap-4">
        <img
          src={
            image ||
            'https://via.placeholder.com/80x80.png?text=Player'
          }
          alt={name}
          className="h-20 w-20 rounded-2xl object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <span className="text-sm font-semibold text-slate-400">
              #{number}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge text={position} />
            <Badge text={nationality} />
            <Badge text={`Form ${form}`} variant={getFormVariant(form)} />
          </div>
        </div>
      </div>
    </Card>
  );
}
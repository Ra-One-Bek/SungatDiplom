import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface MatchResultCardProps {
  opponent: string;
  score: string;
  result: 'win' | 'draw' | 'loss';
  competition: string;
}

function getVariant(result: 'win' | 'draw' | 'loss') {
  if (result === 'win') return 'success';
  if (result === 'draw') return 'warning';
  return 'danger';
}

function getLabel(result: 'win' | 'draw' | 'loss') {
  if (result === 'win') return 'Победа';
  if (result === 'draw') return 'Ничья';
  return 'Поражение';
}

export default function MatchResultCard({
  opponent,
  score,
  result,
  competition,
}: MatchResultCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">vs {opponent}</h3>
          <p className="mt-1 text-sm text-slate-400">{competition}</p>
        </div>

        <Badge text={getLabel(result)} variant={getVariant(result)} />
      </div>

      <p className="mt-4 text-2xl font-bold text-white">{score}</p>
    </Card>
  );
}
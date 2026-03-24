import Card from '../ui/Card';

interface AiSummaryCardProps {
  totalPlayers: number;
  weakSpots: number;
  readyPlayers: number;
  generalAdvice: string;
}

export default function AiSummaryCard({
  totalPlayers,
  weakSpots,
  readyPlayers,
  generalAdvice,
}: AiSummaryCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white">AI-анализ состава</h3>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Игроков в основе</p>
          <p className="mt-2 text-2xl font-bold text-white">{totalPlayers}</p>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Слабые зоны</p>
          <p className="mt-2 text-2xl font-bold text-white">{weakSpots}</p>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Готовы к игре</p>
          <p className="mt-2 text-2xl font-bold text-white">{readyPlayers}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950 p-4">
        <p className="text-sm font-semibold text-slate-300">Общий совет</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{generalAdvice}</p>
      </div>
    </Card>
  );
}
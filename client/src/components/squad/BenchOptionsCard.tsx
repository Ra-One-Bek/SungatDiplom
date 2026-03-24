import Card from '../ui/Card';

interface BenchOptionItem {
  playerId: number;
  name: string;
  position: string;
  roleTarget: string;
  formScore: number;
  compatibility: number;
  finalRecommendationScore: number;
  injured: boolean;
  availability: string;
  advice: string;
}

interface BenchOptionsCardProps {
  currentPlayerName?: string;
  options: BenchOptionItem[];
}

export default function BenchOptionsCard({
  currentPlayerName,
  options,
}: BenchOptionsCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white">Лучшие варианты замены</h3>

      {currentPlayerName ? (
        <p className="mt-1 text-sm text-slate-400">
          Для текущего слота игрока: {currentPlayerName}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {options.length === 0 ? (
          <p className="text-sm text-slate-400">
            Выбери слот на поле, чтобы увидеть рекомендации по заменам.
          </p>
        ) : (
          options.slice(0, 5).map((option) => (
            <div
              key={option.playerId}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{option.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {option.position} → {option.roleTarget}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-400">Итоговая оценка</p>
                  <p className="text-lg font-bold text-white">
                    {option.finalRecommendationScore}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl bg-slate-900 p-2 text-slate-300">
                  Форма: {option.formScore}
                </div>
                <div className="rounded-xl bg-slate-900 p-2 text-slate-300">
                  Совм.: {option.compatibility}%
                </div>
                <div className="rounded-xl bg-slate-900 p-2 text-slate-300">
                  {option.availability}
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {option.advice}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
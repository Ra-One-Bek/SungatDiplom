import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import { getInjuries, type InjuryItem } from '../services/injuries';

export default function Injuries() {
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInjuries() {
      try {
        const data = await getInjuries();
        setInjuries(data);
      } catch (error) {
        console.error('Failed to load injuries:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInjuries();
  }, []);

  if (loading) {
    return <p className="text-slate-300">Загрузка травм...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Травмы"
        subtitle="Реальные данные о травмированных игроках Atletico de Madrid"
      />

      {injuries.length === 0 ? (
        <Card>
          <p className="text-slate-400">Нет активных данных по травмам.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {injuries.map((injury) => (
            <Card key={injury.id}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {injury.playerName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Тип: {injury.type}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Причина: {injury.reason}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-rose-400 font-semibold">
                    {injury.status}
                  </p>
                  {injury.fixtureDate ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(injury.fixtureDate).toLocaleString()}
                    </p>
                  ) : null}
                  {injury.league ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {injury.league}
                    </p>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
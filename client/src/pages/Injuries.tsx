import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import { getInjuries, type InjuryItem } from '../services/injuries';
import { useSelectedClub } from '../context/SelectedClubContext';

const clubTitles: Record<'astana' | 'kairat' | 'kaisar', string> = {
  astana: 'Астаны',
  kairat: 'Кайрата',
  kaisar: 'Кайсара',
};

export default function Injuries() {
  const { selectedClubId } = useSelectedClub();
  const [injuries, setInjuries] = useState<InjuryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInjuries() {
      if (!selectedClubId) return;

      try {
        setLoading(true);
        const data = await getInjuries(selectedClubId);
        setInjuries(data);
      } catch (error) {
        console.error('Failed to load injuries:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInjuries();
  }, [selectedClubId]);

  if (loading) {
    return <p className="text-slate-300">Загрузка травм...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Травмы"
        subtitle={
          selectedClubId
            ? `Актуальные травмы ${clubTitles[selectedClubId]}`
            : 'Актуальные травмы клуба'
        }
      />

      {injuries.length === 0 ? (
        <Card>
          <p className="text-slate-400">Нет активных данных по травмам.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {injuries.map((injury) => (
            <Card key={injury.id}>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {injury.playerName}
                </h3>
                <p className="text-slate-300">Тип: {injury.type}</p>
                <p className="text-slate-300">Причина: {injury.reason}</p>
                <p className="text-slate-300">{injury.status}</p>

                {injury.fixtureDate ? (
                  <p className="text-slate-400">
                    {new Date(injury.fixtureDate).toLocaleString()}
                  </p>
                ) : null}

                {injury.league ? (
                  <p className="text-slate-400">{injury.league}</p>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
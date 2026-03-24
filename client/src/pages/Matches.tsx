import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import { getMatches, type MatchItem } from '../services/matches';

export default function Matches() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return <p className="text-slate-300">Загрузка матчей...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Матчи"
        subtitle="Реальные матчи Atletico de Madrid из API"
      />

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  vs {match.opponent}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {match.competition}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(match.date).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {match.home ? 'Домашний матч' : 'Выездной матч'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {match.score.home ?? '-'} : {match.score.away ?? '-'}
                </p>
                <p className="mt-1 text-sm text-slate-400">{match.status}</p>
                {match.venue ? (
                  <p className="mt-1 text-sm text-slate-500">{match.venue}</p>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
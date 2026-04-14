import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import { getMatches, type MatchItem } from '../services/matches';
import { useSelectedClub } from '../context/SelectedClubContext';

const clubTitles: Record<'astana' | 'kairat' | 'kaisar', string> = {
  astana: 'Астаны',
  kairat: 'Кайрата',
  kaisar: 'Кайсара',
};

export default function Matches() {
  const { selectedClubId } = useSelectedClub();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      if (!selectedClubId) return;

      try {
        setLoading(true);
        const data = await getMatches(selectedClubId);
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [selectedClubId]);

  if (loading) {
    return <p className="text-slate-300">Загрузка матчей...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Матчи"
        subtitle={
          selectedClubId
            ? `Расписание и результаты ${clubTitles[selectedClubId]}`
            : 'Расписание и результаты клуба'
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                vs {match.opponent}
              </h3>
              <p className="text-slate-400">{match.competition}</p>
              <p className="text-slate-300">
                {new Date(match.date).toLocaleString()}
              </p>
              <p className="text-slate-300">
                {match.home ? 'Домашний матч' : 'Выездной матч'}
              </p>
              <p className="text-white font-medium">
                {match.score.home ?? '-'} : {match.score.away ?? '-'}
              </p>
              <p className="text-slate-300">{match.status}</p>
              {match.venue ? <p className="text-slate-400">{match.venue}</p> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
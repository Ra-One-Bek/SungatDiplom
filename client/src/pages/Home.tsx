import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ClubStatCard from '../components/club/ClubStatCard';
import MatchResultCard from '../components/club/MatchResultCard';
import PlayerCard from '../components/player/PlayerCard';
import { getClub } from '../services/club';
import { getPlayers } from '../services/players';
import type { Club } from '../types/club';
import type { Player } from '../types/player';
import { useSelectedClub } from '../context/SelectedClubContext';

export default function Home() {
  const { selectedClubId } = useSelectedClub();
  const [club, setClub] = useState<Club | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!selectedClubId) return;

      try {
        const [clubData, playersData] = await Promise.all([
          getClub(selectedClubId),
          getPlayers(selectedClubId),
        ]);

        setClub(clubData);
        setPlayers(playersData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    }

    loadData();
  }, [selectedClubId]);

  if (!club) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Главная панель"
        subtitle={`Обзор клуба ${club.info.name} и текущей формы игроков`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ClubStatCard
          title="Матчи"
          value={club.stats.matchesPlayed}
          description="Всего сыграно матчей"
        />
        <ClubStatCard
          title="Победы"
          value={club.stats.wins}
          description="Количество побед в сезоне"
        />
        <ClubStatCard
          title="Забито голов"
          value={club.stats.goalsScored}
          description="Общий показатель команды"
        />
        <ClubStatCard
          title="Сухие матчи"
          value={club.stats.cleanSheets}
          description="Матчи без пропущенных голов"
        />
      </div>

      <section>
        <SectionTitle
          title="Последние матчи"
          subtitle="Краткий обзор последних результатов клуба"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {club.recentMatches.map((match) => (
            <MatchResultCard
              key={match.id}
              opponent={match.opponent}
              score={match.score}
              result={match.result}
              competition={match.competition}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Игроки в центре внимания"
          subtitle="Футболисты с хорошей текущей формой"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              number={player.number}
              position={player.position}
              nationality={player.nationality}
              form={player.form}
              image={player.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
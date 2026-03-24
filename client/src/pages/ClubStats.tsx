import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import ClubStatCard from '../components/club/ClubStatCard';
import MatchResultCard from '../components/club/MatchResultCard';
import { getClub } from '../services/club';
import type { Club } from '../types/club';
import { formatPercentage } from '../utils/helpers';

export default function ClubStats() {
  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    async function loadClub() {
      const data = await getClub();
      setClub(data);
    }

    loadClub();
  }, []);

  if (!club) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Статистика клуба"
        subtitle="Ключевые показатели Atletico de Madrid"
      />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <img
            src={club.info.logo}
            alt={club.info.name}
            className="h-24 w-24 rounded-3xl object-cover"
          />

          <div>
            <h3 className="text-2xl font-bold text-white">{club.info.name}</h3>
            <p className="mt-2 text-slate-400">
              {club.info.country} · {club.info.stadium}
            </p>
            <p className="mt-1 text-slate-400">Тренер: {club.info.coach}</p>
            <p className="mt-1 text-slate-400">Основан: {club.info.founded}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ClubStatCard title="Победы" value={club.stats.wins} />
        <ClubStatCard title="Ничьи" value={club.stats.draws} />
        <ClubStatCard title="Поражения" value={club.stats.losses} />
        <ClubStatCard
          title="Владение мячом"
          value={formatPercentage(club.stats.averagePossession)}
        />
        <ClubStatCard title="Забито" value={club.stats.goalsScored} />
        <ClubStatCard title="Пропущено" value={club.stats.goalsConceded} />
        <ClubStatCard title="Сухие матчи" value={club.stats.cleanSheets} />
        <ClubStatCard title="Матчи" value={club.stats.matchesPlayed} />
      </div>

      <section>
        <SectionTitle
          title="Последние матчи"
          subtitle="Актуальные результаты команды"
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
            title="Лучшие бомбардиры"
            subtitle="Игроки с наибольшим количеством голов"
        />
        <Card>
            {club.topScorers.length === 0 ? (
            <p className="text-slate-400">
                Данные о бомбардирах пока не загружены.
            </p>
            ) : (
            <div className="space-y-3">
                {club.topScorers.map((scorer, index) => (
                <div
                    key={scorer.playerId}
                    className="flex items-center justify-between border-b border-slate-800 py-3 last:border-b-0"
                >
                    <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                        {index + 1}
                    </span>
                    <span className="font-medium text-white">{scorer.name}</span>
                    </div>

                    <span className="text-slate-300">{scorer.goals} голов</span>
                </div>
                ))}
            </div>
            )}
        </Card>
        </section>
    </div>
  );
}
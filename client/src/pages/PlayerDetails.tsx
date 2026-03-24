import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';
import PlayerStatRow from '../components/player/PlayerStatRow';
import { getPlayerById } from '../services/players';
import { getPlayerFormById, type PlayerFormItem } from '../services/analytics';
import type { Player } from '../types/player';
import { formatRating, getFormLabel, getInjuryLabel } from '../utils/helpers';

export default function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerForm, setPlayerForm] = useState<PlayerFormItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPlayer() {
      try {
        if (!id) return;

        const [playerData, formData] = await Promise.all([
          getPlayerById(Number(id)),
          getPlayerFormById(Number(id)),
        ]);

        setPlayer(playerData);
        setPlayerForm(formData);
      } catch (error) {
        console.error('Failed to load player:', error);
        setNotFound(true);
      }
    }

    loadPlayer();
  }, [id]);

  if (notFound) {
    return (
      <div className="space-y-4">
        <SectionTitle title="Игрок не найден" />
        <Card>
          <p className="text-slate-300">Такого игрока нет в данных.</p>
        </Card>
      </div>
    );
  }

  if (!player) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title={player.name}
        subtitle="Подробная статистика и аналитическая оценка формы"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="flex flex-col items-center text-center">
            <img
              src={player.image}
              alt={player.name}
              className="h-32 w-32 rounded-3xl object-cover"
            />
            <h3 className="mt-4 text-2xl font-bold text-white">{player.name}</h3>
            <p className="mt-1 text-slate-400">
              #{player.number} · {player.position}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge text={player.nationality} />
              <Badge
                text={
                  playerForm
                    ? `Форма ${playerForm.formScore}`
                    : getFormLabel(player.form)
                }
                variant="success"
              />
              <Badge text={getInjuryLabel(player.injuryStatus)} variant="warning" />
            </div>

            <div className="mt-6 w-full">
              <PlayerStatRow label="Возраст" value={player.age} />
              <PlayerStatRow
                label="Форма"
                value={playerForm ? playerForm.formScore : player.form}
              />
              <PlayerStatRow
                label="Доступность"
                value={playerForm ? playerForm.availability : 'unknown'}
              />
              <PlayerStatRow
                label="Средний рейтинг"
                value={formatRating(player.stats.rating)}
              />
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <h3 className="mb-4 text-xl font-bold text-white">Сезонная статистика</h3>
          <PlayerStatRow label="Матчи" value={player.stats.appearances} />
          <PlayerStatRow label="Минуты" value={player.stats.minutes} />
          <PlayerStatRow label="Голы" value={player.stats.goals} />
          <PlayerStatRow label="Ассисты" value={player.stats.assists} />
          <PlayerStatRow label="Желтые карточки" value={player.stats.yellowCards} />
          <PlayerStatRow label="Красные карточки" value={player.stats.redCards} />
        </Card>

        <Card className="xl:col-span-1">
          <h3 className="mb-4 text-xl font-bold text-white">Аналитика</h3>
          <PlayerStatRow
            label="Форма по модели"
            value={playerForm ? playerForm.formScore : '—'}
          />
          <PlayerStatRow
            label="Травма"
            value={playerForm ? (playerForm.injured ? 'Да' : 'Нет') : '—'}
          />
          <div className="mt-4 rounded-2xl bg-slate-950 p-4">
            <p className="text-sm font-semibold text-slate-300">Рекомендация</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {playerForm
                ? playerForm.recommendation
                : 'Рекомендация пока недоступна.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
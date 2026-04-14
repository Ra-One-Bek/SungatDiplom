import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';
import PlayerStatRow from '../components/player/PlayerStatRow';
import { getPlayerById } from '../services/players';
import { getPlayerFormById, type PlayerFormItem } from '../services/analytics';
import type { Player } from '../types/player';
import { formatRating, getFormLabel } from '../utils/helpers';
import { useSelectedClub } from '../context/SelectedClubContext';

export default function PlayerDetails() {
  const { id } = useParams();
  const { selectedClubId } = useSelectedClub();

  const [player, setPlayer] = useState<Player | null>(null);
  const [playerForm, setPlayerForm] = useState<PlayerFormItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPlayer() {
      try {
        if (!id || !selectedClubId) return;

        const [playerData, formData] = await Promise.all([
          getPlayerById(Number(id), selectedClubId),
          getPlayerFormById(Number(id), selectedClubId),
        ]);

        setPlayer(playerData);
        setPlayerForm(formData);
        setNotFound(false);
      } catch (error) {
        console.error('Failed to load player:', error);
        setNotFound(true);
      }
    }

    loadPlayer();
  }, [id, selectedClubId]);

  if (notFound) {
    return <p className="text-slate-300">Такого игрока нет в данных.</p>;
  }

  if (!player) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title={player.name}
        subtitle={`#${player.number} · ${player.position}`}
      />

      <Card>
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={player.image}
            alt={player.name}
            className="h-48 w-48 rounded-3xl object-cover"
          />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge text={player.nationality} />
              <Badge text={player.position} />
              {playerForm ? (
                <Badge text={getFormLabel(playerForm.formScore)} />
              ) : null}
              <Badge text={playerForm?.availability ?? 'Статус неизвестен'} />
            </div>

            <div className="space-y-2 text-slate-300">
              <p>Возраст: {player.age}</p>
              <p>Номер: {player.number}</p>
              <p>Текущая форма: {formatRating(player.form)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle
          title="Сезонная статистика"
          subtitle="Основные показатели игрока"
        />

        <div className="space-y-2">
          <PlayerStatRow label="Голы" value={player.stats.goals} />
          <PlayerStatRow label="Ассисты" value={player.stats.assists} />
          <PlayerStatRow label="Жёлтые карточки" value={player.stats.yellowCards} />
          <PlayerStatRow label="Красные карточки" value={player.stats.redCards} />
          <PlayerStatRow label="Минуты" value={player.stats.minutes} />
          <PlayerStatRow
            label="Средний рейтинг"
            value={formatRating(player.stats.rating)}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle title="Аналитика" subtitle="Форма и рекомендации" />

        {playerForm ? (
          <div className="space-y-2 text-slate-300">
            <PlayerStatRow label="Form score" value={playerForm.formScore} />
            <PlayerStatRow label="Доступность" value={playerForm.availability} />
            <PlayerStatRow label="Минуты" value={playerForm.minutes} />
            <PlayerStatRow label="Голы" value={playerForm.goals} />
            <PlayerStatRow label="Ассисты" value={playerForm.assists} />
            <PlayerStatRow
              label="Жёлтые карточки"
              value={playerForm.yellowCards}
            />
            <PlayerStatRow
              label="Красные карточки"
              value={playerForm.redCards}
            />
          </div>
        ) : (
          <p className="text-slate-400">Аналитические данные пока недоступны.</p>
        )}

        <div className="mt-4 rounded-2xl bg-slate-800 p-4">
          <h4 className="mb-2 font-semibold text-white">Рекомендация</h4>
          <p className="text-slate-300">
            {playerForm
              ? playerForm.recommendation
              : 'Рекомендация пока недоступна.'}
          </p>
        </div>
      </Card>
    </div>
  );
}
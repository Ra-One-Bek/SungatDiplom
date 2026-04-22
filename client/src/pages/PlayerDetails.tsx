import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Badge from '../components/ui/Badge';
import PlayerStatRow from '../components/player/PlayerStatRow';
import { getPlayerById } from '../services/players';
import {
  getPlayerFormById,
  type PlayerFormItem,
} from '../services/analytics';
import type { Player } from '../types/player';
import { formatRating, getFormLabel } from '../utils/helpers';
import { useSelectedClub } from '../context/SelectedClubContext';

export default function PlayerDetails() {
  const { id } = useParams<{ id: string }>();
  const { selectedClubId } = useSelectedClub();

  const [player, setPlayer] = useState<Player | null>(null);
  const [playerForm, setPlayerForm] = useState<PlayerFormItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPlayer() {
      try {
        if (!id || !selectedClubId) return;

        const playerData = await getPlayerById(id, selectedClubId);
        setPlayer(playerData);

        if (playerData.externalPlayerId) {
          try {
            const formData = await getPlayerFormById(
              playerData.externalPlayerId,
              selectedClubId,
            );
            setPlayerForm(formData);
          } catch (formError) {
            console.error('Failed to load player form:', formError);
            setPlayerForm(null);
          }
        } else {
          setPlayerForm(null);
        }

        setNotFound(false);
      } catch (error) {
        console.error('Failed to load player:', error);
        setNotFound(true);
      }
    }

    loadPlayer();
  }, [id, selectedClubId]);

  if (notFound) {
    return <div className="text-white">Такого игрока нет в данных.</div>;
  }

  if (!player) {
    return <div className="text-white">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title={player.name}
        subtitle={`${player.position} • ${player.nationality}`}
      />

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={player.image || player.photo}
            alt={player.name}
            className="h-48 w-48 rounded-2xl object-cover"
          />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge text={player.position} />
              <Badge text={player.nationality} />
              <Badge text={`Источник: ${player.source}`} />
              {player.source === 'hybrid' ? (
                <Badge text="Изменен админом" />
              ) : null}
              {player.source === 'admin' ? (
                <Badge text="Локальный игрок" />
              ) : null}
            </div>

            <div className="text-white/80">Возраст: {player.age}</div>
            <div className="text-white/80">Номер: {player.number}</div>
            <div className="text-white/80">
              Текущая форма: {formatRating(player.form)}
            </div>

            {player.adminNote ? (
              <div className="rounded-xl bg-white/5 p-3 text-sm text-white/80">
                Заметка админа: {player.adminNote}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Статистика</h3>

        <div className="space-y-2">
          <PlayerStatRow label="Матчи" value={player.stats.appearances} />
          <PlayerStatRow label="В старте" value={player.stats.lineups} />
          <PlayerStatRow label="Минуты" value={player.stats.minutes} />
          <PlayerStatRow label="Голы" value={player.stats.goals} />
          <PlayerStatRow label="Ассисты" value={player.stats.assists} />
          <PlayerStatRow
            label="Желтые карточки"
            value={player.stats.yellowCards}
          />
          <PlayerStatRow
            label="Красные карточки"
            value={player.stats.redCards}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Аналитика</h3>

        {playerForm ? (
          <div className="space-y-3 text-white/80">
            <div>Оценка формы: {formatRating(playerForm.formScore)}</div>
            <div>Статус: {getFormLabel(playerForm.formScore)}</div>
            <div>Доступность: {playerForm.availability}</div>

            <div>
              <h4 className="mb-2 text-base font-semibold text-white">
                Рекомендация
              </h4>
              <p>{playerForm.recommendation}</p>
            </div>
          </div>
        ) : (
          <div className="text-white/70">
            Аналитические данные пока недоступны.
          </div>
        )}
      </Card>
    </div>
  );
}
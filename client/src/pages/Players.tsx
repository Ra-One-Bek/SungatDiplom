import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import PlayerCard from '../components/player/PlayerCard';
import { getPlayers } from '../services/players';
import { getPlayersForm, type PlayerFormItem } from '../services/analytics';
import type { Player } from '../types/player';
import { useSelectedClub } from '../context/SelectedClubContext';

export default function Players() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<Player[]>([]);
  const [forms, setForms] = useState<PlayerFormItem[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(true);

  useEffect(() => {
    async function loadPlayersOnly() {
      if (!selectedClubId) return;

      try {
        setPlayersLoading(true);
        const playersData = await getPlayers(selectedClubId);
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to load players:', error);
      } finally {
        setPlayersLoading(false);
      }
    }

    loadPlayersOnly();
  }, [selectedClubId]);

  useEffect(() => {
    async function loadFormsOnly() {
      if (!selectedClubId) return;

      try {
        setFormsLoading(true);
        const formsData = await getPlayersForm(selectedClubId);
        setForms(formsData);
      } catch (error) {
        console.error('Failed to load players form:', error);
      } finally {
        setFormsLoading(false);
      }
    }

    loadFormsOnly();
  }, [selectedClubId]);

  const mergedPlayers = useMemo(() => {
    return players.map((player) => {
      if (!player.externalPlayerId) {
        return player;
      }

      const formData = forms.find(
        (item) => item.playerId === player.externalPlayerId,
      );

      return {
        ...player,
        form: formData?.formScore ?? player.form ?? 0,
      };
    });
  }, [players, forms]);

  if (playersLoading) {
    return <div className="text-white">Загрузка игроков...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Игроки клуба"
        subtitle="Состав, форма и ключевая информация по каждому игроку"
      />

      {formsLoading ? (
        <div className="text-sm text-gray-300">
          Аналитическая форма игроков еще загружается...
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mergedPlayers.map((player) => (
          <Link key={player.id} to={`/players/${player.id}`}>
            <PlayerCard player={player} />
          </Link>
        ))}
      </div>
    </div>
  );
}
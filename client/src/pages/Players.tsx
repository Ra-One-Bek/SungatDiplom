import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import PlayerCard from '../components/player/PlayerCard';
import { getPlayers } from '../services/players';
import { getPlayersForm } from '../services/analytics';
import type { Player } from '../types/player';
import type { PlayerFormItem } from '../services/analytics';

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [forms, setForms] = useState<PlayerFormItem[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(true);

  useEffect(() => {
    async function loadPlayersOnly() {
      try {
        const playersData = await getPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error('Failed to load players:', error);
      } finally {
        setPlayersLoading(false);
      }
    }

    loadPlayersOnly();
  }, []);

  useEffect(() => {
    async function loadFormsOnly() {
      try {
        const formsData = await getPlayersForm();
        setForms(formsData);
      } catch (error) {
        console.error('Failed to load players form:', error);
      } finally {
        setFormsLoading(false);
      }
    }

    loadFormsOnly();
  }, []);

  const mergedPlayers = useMemo(() => {
    return players.map((player) => {
      const formData = forms.find((item) => item.playerId === player.id);

      return {
        ...player,
        form: formData?.formScore ?? player.form ?? 0,
      };
    });
  }, [players, forms]);

  if (playersLoading) {
    return <p className="text-slate-300">Загрузка игроков...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Игроки"
        subtitle="Список футболистов Atletico de Madrid"
      />

      {formsLoading ? (
        <p className="text-sm text-slate-400">
          Аналитическая форма игроков еще загружается...
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mergedPlayers.map((player) => (
          <Link key={player.id} to={`/players/${player.id}`}>
            <PlayerCard
              name={player.name}
              number={player.number}
              position={player.position}
              nationality={player.nationality}
              form={player.form}
              image={player.image}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import { useSelectedClub } from '../context/SelectedClubContext';
import { getPlayers } from '../services/players';
import {
  getOverrides,
  upsertOverride,
  type PlayerOverride,
} from '../services/adminOverrides';
import type { Player } from '../types/player';

export default function AdminOverrides() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<Player[]>([]);
  const [overrides, setOverrides] = useState<PlayerOverride[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [form, setForm] = useState({
    name: '',
    number: '',
    position: '',
    hidden: false,
    note: '',
  });

  async function load() {
    if (!selectedClubId) return;

    const [playersData, overridesData] = await Promise.all([
      getPlayers(selectedClubId),
      getOverrides(selectedClubId),
    ]);

    setPlayers(playersData);
    setOverrides(overridesData);
  }

  useEffect(() => {
    load();
  }, [selectedClubId]);

  async function handleSave() {
    if (!selectedPlayer || !selectedClubId) return;

    await upsertOverride({
      externalPlayerId: selectedPlayer.externalPlayerId!,
      clubId: selectedClubId,
      customName: form.name || undefined,
      customNumber: form.number ? Number(form.number) : undefined,
      customPosition: form.position || undefined,
      isHidden: form.hidden,
      note: form.note || undefined,
    });

    await load();
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Admin · Overrides"
        subtitle="Изменение API игроков"
      />

      <Card>
        <h3 className="text-lg font-bold">Игроки</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {players
            .filter((p) => p.externalPlayerId)
            .map((player) => (
              <button
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setForm({
                    name: player.name,
                    number: String(player.number),
                    position: player.position,
                    hidden: false,
                    note: '',
                  });
                }}
                className="rounded-xl border p-3 text-left hover:bg-slate-50"
              >
                <div className="font-bold">{player.name}</div>
                <div className="text-sm text-slate-500">
                  #{player.number} • {player.position}
                </div>
              </button>
            ))}
        </div>
      </Card>

      {selectedPlayer && (
        <Card>
          <h3 className="text-lg font-bold">
            Редактирование: {selectedPlayer.name}
          </h3>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Имя"
              className="border rounded-xl px-3 py-2"
            />

            <input
              value={form.number}
              onChange={(e) =>
                setForm((p) => ({ ...p, number: e.target.value }))
              }
              placeholder="Номер"
              className="border rounded-xl px-3 py-2"
            />

            <input
              value={form.position}
              onChange={(e) =>
                setForm((p) => ({ ...p, position: e.target.value }))
              }
              placeholder="Позиция"
              className="border rounded-xl px-3 py-2"
            />

            <input
              value={form.note}
              onChange={(e) =>
                setForm((p) => ({ ...p, note: e.target.value }))
              }
              placeholder="Заметка"
              className="border rounded-xl px-3 py-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) =>
                  setForm((p) => ({ ...p, hidden: e.target.checked }))
                }
              />
              Скрыть игрока
            </label>
          </div>

          <div className="mt-4">
            <Button onClick={handleSave}>Сохранить override</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
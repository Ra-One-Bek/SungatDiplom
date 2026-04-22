import { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import { useSelectedClub } from '../context/SelectedClubContext';
import {
  createAdminPlayer,
  deactivateAdminPlayer,
  getAdminPlayers,
  restoreAdminPlayer,
  type AdminPlayer,
} from '../services/admin';

type FormState = {
  name: string;
  firstname: string;
  lastname: string;
  age: string;
  number: string;
  position: string;
  nationality: string;
  photo: string;
};

const initialForm: FormState = {
  name: '',
  firstname: '',
  lastname: '',
  age: '',
  number: '',
  position: 'Midfielder',
  nationality: 'Kazakhstan',
  photo: '',
};

export default function AdminPlayers() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(initialForm);

  async function loadPlayers() {
    if (!selectedClubId) return;

    try {
      setLoading(true);
      setError('');
      const data = await getAdminPlayers(selectedClubId, includeInactive);
      setPlayers(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить локальных игроков');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, [selectedClubId, includeInactive]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClubId) return;

    try {
      setSubmitting(true);
      setError('');

      await createAdminPlayer({
        clubId: selectedClubId,
        name: form.name.trim(),
        firstname: form.firstname.trim() || undefined,
        lastname: form.lastname.trim() || undefined,
        age: form.age ? Number(form.age) : undefined,
        number: form.number ? Number(form.number) : undefined,
        position: form.position.trim(),
        nationality: form.nationality.trim() || undefined,
        photo: form.photo.trim() || undefined,
      });

      setForm(initialForm);
      await loadPlayers();
    } catch (err) {
      console.error(err);
      setError('Не удалось создать локального игрока');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(id: number) {
    try {
      setActionId(id);
      await deactivateAdminPlayer(id);
      await loadPlayers();
    } catch (err) {
      console.error(err);
      setError('Не удалось деактивировать игрока');
    } finally {
      setActionId(null);
    }
  }

  async function handleRestore(id: number) {
    try {
      setActionId(id);
      await restoreAdminPlayer(id);
      await loadPlayers();
    } catch (err) {
      console.error(err);
      setError('Не удалось восстановить игрока');
    } finally {
      setActionId(null);
    }
  }

  const activeCount = useMemo(
    () => players.filter((player) => player.isActive).length,
    [players],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Админ · Локальные игроки"
        subtitle="Создание и управление локальными игроками клуба"
      />

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Текущий клуб: {selectedClubId}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Всего записей: {players.length} • активных: {activeCount}
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            Показать неактивных
          </label>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-black text-slate-900">
          Добавить локального игрока
        </h3>

        <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Полное имя"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            required
          />

          <input
            value={form.position}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, position: e.target.value }))
            }
            placeholder="Позиция"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            required
          />

          <input
            value={form.firstname}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstname: e.target.value }))
            }
            placeholder="Имя"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            value={form.lastname}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastname: e.target.value }))
            }
            placeholder="Фамилия"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            value={form.age}
            onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
            placeholder="Возраст"
            type="number"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            value={form.number}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, number: e.target.value }))
            }
            placeholder="Номер"
            type="number"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            value={form.nationality}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nationality: e.target.value }))
            }
            placeholder="Гражданство"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            value={form.photo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, photo: e.target.value }))
            }
            placeholder="URL фото"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать игрока'}
            </Button>
          </div>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
      </Card>

      <Card>
        <h3 className="text-lg font-black text-slate-900">
          Список локальных игроков
        </h3>

        {loading ? (
          <p className="mt-4 text-slate-500">Загрузка...</p>
        ) : players.length === 0 ? (
          <p className="mt-4 text-slate-500">Локальных игроков пока нет.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-900">{player.name}</h4>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        player.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {player.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {player.position} • #{player.number ?? '-'} •{' '}
                    {player.nationality ?? 'Unknown'}
                  </p>
                </div>

                <div className="flex gap-3">
                  {player.isActive ? (
                    <Button
                      onClick={() => handleDeactivate(player.id)}
                      disabled={actionId === player.id}
                    >
                      {actionId === player.id ? '...' : 'Отключить'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRestore(player.id)}
                      disabled={actionId === player.id}
                    >
                      {actionId === player.id ? '...' : 'Восстановить'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
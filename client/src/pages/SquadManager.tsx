import { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSelectedClub } from '../context/SelectedClubContext';
import FootballField from '../components/squad/FootballField';
import FormationSelector from '../components/squad/FormationSelector';
import BenchList from '../components/squad/BenchList';
import RecommendationBox from '../components/squad/RecommendationBox';
import AiSummaryCard from '../components/squad/AiSummaryCard';
import SetPiecesPanel from '../components/squad/SetPiecesPanel';

import { getPlayers } from '../services/players';
import {
  getSquad,
  replacePlayer,
  swapLineupPlayers,
  updateFormation,
} from '../services/squad';
import {
  getSquadRecommendations,
  type SquadRecommendationsResponse,
} from '../services/ai';

import type { Player } from '../types/player';
import type { SquadData, SetPieces } from '../types/squad';

type DragPayload =
  | { sourceType: 'lineup'; slotId: number }
  | { sourceType: 'bench' | 'reserves'; itemId: number };

export default function SquadManager() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [loadingAction, setLoadingAction] = useState(false);

  const [aiSummary, setAiSummary] =
    useState<SquadRecommendationsResponse | null>(null);

  const [setPieces, setSetPieces] = useState<SetPieces>({
    penalty: null,
    freeKick: null,
    corner: null,
    captain: null,
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedBenchId, setSelectedBenchId] = useState<number | null>(null);
  const [selectedReserveId, setSelectedReserveId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!selectedClubId) return;

      const [playersData, squadData, aiData] = await Promise.all([
        getPlayers(selectedClubId),
        getSquad(selectedClubId),
        getSquadRecommendations(),
      ]);

      setPlayers(playersData);
      setSquad(squadData);
      setFormation(squadData.formation);
      setAiSummary(aiData);

      setSetPieces(
        squadData.setPieces || {
          penalty: null,
          freeKick: null,
          corner: null,
          captain: null,
        },
      );
    }

    load();
  }, [selectedClubId]);

  const selectedSlot = useMemo(() => {
    if (!squad || !selectedSlotId) return null;
    return squad.lineup.find((slot) => slot.id === selectedSlotId) ?? null;
  }, [squad, selectedSlotId]);

  const tacticalAdvice = useMemo(() => {
    if (!squad) return '';

    const weakSlots = squad.lineup.filter((slot) => {
      const player = players.find((p) => p.id === slot.playerId);
      return player && (player.form ?? 0) < 6.5;
    });

    if (weakSlots.length >= 3) {
      return 'Несколько игроков в слабой форме — стоит сделать ротацию или перестроить состав.';
    }

    if (weakSlots.length >= 1) {
      return 'Есть позиции с просадкой по форме. Проверь крайние зоны и центр поля.';
    }

    return 'Состав выглядит сбалансированным. Его можно использовать как основной на ближайший матч.';
  }, [squad, players]);

  const filteredPlayers = useMemo(() => {
    if (!selectedSlot || !players.length) return players;

    return [...players].sort((a, b) => {
      const aMatch = a.position === selectedSlot.role ? 1 : 0;
      const bMatch = b.position === selectedSlot.role ? 1 : 0;

      if (aMatch !== bMatch) return bMatch - aMatch;
      return (b.form ?? 0) - (a.form ?? 0);
    });
  }, [players, selectedSlot]);

  function updateSetPiece(key: keyof SetPieces, playerId: number) {
    setSetPieces((prev) => ({
      ...prev,
      [key]: playerId,
    }));
  }

  function buildAutoLineup() {
    if (!squad) return;

    const best = [...players]
      .sort((a, b) => {
        const aScore = (a.form ?? 0) + (a.stats?.rating ?? 0);
        const bScore = (b.form ?? 0) + (b.stats?.rating ?? 0);
        return bScore - aScore;
      })
      .slice(0, squad.lineup.length);

    const updatedLineup = squad.lineup.map((slot, index) => ({
      ...slot,
      playerId: best[index]?.id ?? slot.playerId,
      name: best[index]?.name ?? slot.name,
    }));

    setSquad({
      ...squad,
      lineup: updatedLineup,
    });
  }

  async function handleFormationChange(newFormation: string) {
    try {
      setLoadingAction(true);
      if (!selectedClubId) return;
      const updated = await updateFormation(newFormation, selectedClubId);
      setSquad(updated);
      setFormation(updated.formation);
      setSelectedSlotId(null);
      setSelectedBenchId(null);
      setSelectedReserveId(null);
    } catch (error) {
      console.error('Failed to update formation:', error);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleDropOnSlot(slotId: number, rawPayload: string) {
    try {
      const payload = JSON.parse(rawPayload) as DragPayload;

      setLoadingAction(true);

      if (payload.sourceType === 'lineup') {
        if (!selectedClubId) return;
        const updated = await swapLineupPlayers(slotId, payload.slotId, selectedClubId);
        setSquad(updated);
      } else {
        if (!selectedClubId) return;
        const updated = await replacePlayer(
          slotId,
          payload.sourceType,
          payload.itemId,
          selectedClubId,
        );
        setSquad(updated);
      }

      setSelectedSlotId(null);
      setSelectedBenchId(null);
      setSelectedReserveId(null);
    } catch (error) {
      console.error('Failed to handle drag/drop:', error);
    } finally {
      setLoadingAction(false);
    }
  }

  async function assignSelectedBenchPlayer() {
    if (!selectedSlotId) return;

    try {
      setLoadingAction(true);

      if (selectedBenchId) {
        if (!selectedClubId) return;
        const updated = await replacePlayer(
          selectedSlotId,
          'bench',
          selectedBenchId,
          selectedClubId,
        );
        setSquad(updated);
      } else if (selectedReserveId) {
        if (!selectedClubId) return;
        const updated = await replacePlayer(
          selectedSlotId,
          'reserves',
          selectedReserveId,
          selectedClubId,
        );
        setSquad(updated);
      }

      setSelectedSlotId(null);
      setSelectedBenchId(null);
      setSelectedReserveId(null);
    } catch (error) {
      console.error('Failed to replace player:', error);
    } finally {
      setLoadingAction(false);
    }
  }

  if (!squad) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Менеджер состава"
        subtitle="Drag & drop состав, стандарты, AI-подбор и тактические подсказки"
      />

      {aiSummary ? (
        <AiSummaryCard
          totalPlayers={aiSummary.summary.totalPlayers}
          weakSpots={aiSummary.summary.weakSpots}
          readyPlayers={aiSummary.summary.readyPlayers}
          generalAdvice={aiSummary.generalAdvice}
        />
      ) : null}

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Схема</h3>
            <p className="mt-1 text-sm text-slate-500">
              Меняй схему и собирай состав как в FIFA Career
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FormationSelector
              value={formation}
              onChange={handleFormationChange}
            />
            <Button onClick={buildAutoLineup} disabled={loadingAction}>
              AI авто-состав
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <RecommendationBox
          title="Анализ состава"
          message={tacticalAdvice}
          level="good"
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <FootballField
            players={squad.lineup}
            selectedSlotId={selectedSlotId}
            onSelectSlot={(slotId) => {
              setSelectedSlotId(slotId);
              setSelectedBenchId(null);
              setSelectedReserveId(null);
            }}
            onDropOnSlot={handleDropOnSlot}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-black text-slate-900">
              Выбранная позиция
            </h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              {selectedSlot ? (
                <>
                  <p className="text-sm text-slate-500">Роль</p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedSlot.role}
                  </p>

                  <p className="mt-4 text-sm text-slate-500">Текущий игрок</p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedSlot.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Выбери слот на поле, чтобы заменить игрока или перетащить туда
                  другого исполнителя.
                </p>
              )}
            </div>
          </Card>

          <BenchList
            title="Запасные"
            players={squad.bench}
            selectedItemId={selectedBenchId}
            onSelectItem={(itemId) => {
              setSelectedBenchId(itemId);
              setSelectedReserveId(null);
            }}
            sourceType="bench"
          />

          <BenchList
            title="Резерв"
            players={squad.reserves}
            selectedItemId={selectedReserveId}
            onSelectItem={(itemId) => {
              setSelectedReserveId(itemId);
              setSelectedBenchId(null);
            }}
            sourceType="reserves"
          />

          <Card>
            <h3 className="text-lg font-black text-slate-900">
              Быстрая замена по клику
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Сначала выбери слот на поле, потом кандидата из списка и нажми
              кнопку.
            </p>

            <div className="mt-5 max-h-[260px] space-y-3 overflow-y-auto pr-1">
              {filteredPlayers.map((player) => {
                const isSelected = selectedBenchId === player.id;

                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => {
                      setSelectedBenchId(player.id);
                      setSelectedReserveId(null);
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? 'border-[var(--club-primary)] bg-[var(--club-surface)]'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{player.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {player.position} • форма {player.form ?? 0}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500 shadow-sm">
                        candidate
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <Button
                onClick={assignSelectedBenchPlayer}
                disabled={!selectedSlotId || (!selectedBenchId && !selectedReserveId)}
              >
                Назначить выбранного игрока
              </Button>
            </div>
          </Card>

          <SetPiecesPanel
            players={players}
            setPieces={setPieces}
            onChange={updateSetPiece}
          />
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FootballField from '../components/squad/FootballField';
import FormationSelector from '../components/squad/FormationSelector';
import BenchList from '../components/squad/BenchList';
import RecommendationBox from '../components/squad/RecommendationBox';
import AiSummaryCard from '../components/squad/AiSummaryCard';
import RoleAlertsCard from '../components/squad/RoleAlertsCard';
import BenchOptionsCard from '../components/squad/BenchOptionsCard';
import { getPlayers } from '../services/players';
import {
  getSquad,
  replacePlayer,
  swapLineupPlayers,
  updateFormation,
} from '../services/squad';
import {
  getBenchOptions,
  getRoleAlerts,
  getSquadRecommendations,
  type BenchOptionsResponse,
  type RoleAlertItem,
  type SquadRecommendationsResponse,
} from '../services/ai';
import type { Player } from '../types/player';
import type { SquadData } from '../types/squad';
import {
  getCompatibilityLevel,
  getCompatibilityMessage,
  getPositionCompatibility,
} from '../utils/formation';

type SelectedSource =
  | { type: 'lineup'; slotId: number }
  | { type: 'bench'; itemId: number }
  | { type: 'reserves'; itemId: number }
  | null;

export default function SquadManager() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [loading, setLoading] = useState(false);

  const [aiSummary, setAiSummary] = useState<SquadRecommendationsResponse | null>(null);
  const [roleAlerts, setRoleAlerts] = useState<RoleAlertItem[]>([]);
  const [benchOptions, setBenchOptions] = useState<BenchOptionsResponse | null>(null);

  const [selectedLineupSlotId, setSelectedLineupSlotId] = useState<number | null>(null);
  const [selectedSource, setSelectedSource] = useState<SelectedSource>(null);

  async function loadAiData(slotId?: number) {
    try {
      const [summaryData, alertsData] = await Promise.all([
        getSquadRecommendations(),
        getRoleAlerts(),
      ]);

      setAiSummary(summaryData);
      setRoleAlerts(alertsData);

      if (slotId) {
        const optionsData = await getBenchOptions(slotId);
        setBenchOptions(optionsData);
      } else {
        setBenchOptions(null);
      }
    } catch (error) {
      console.error('Failed to load AI data:', error);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [playersData, squadData] = await Promise.all([
          getPlayers(),
          getSquad(),
        ]);

        setPlayers(playersData);
        setSquad(squadData);
        setFormation(squadData.formation);

        await loadAiData();
      } catch (error) {
        console.error('Failed to load squad data:', error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedLineupSlotId) {
      setBenchOptions(null);
      return;
    }

    loadAiData(selectedLineupSlotId);
  }, [selectedLineupSlotId]);

  const selectedLineupSlot = useMemo(() => {
    if (!squad || !selectedLineupSlotId) return null;
    return squad.lineup.find((slot) => slot.id === selectedLineupSlotId) || null;
  }, [squad, selectedLineupSlotId]);

  const selectedBenchItem = useMemo(() => {
    if (!squad || !selectedSource || selectedSource.type !== 'bench') return null;
    return squad.bench.find((item) => item.id === selectedSource.itemId) || null;
  }, [squad, selectedSource]);

  const selectedReserveItem = useMemo(() => {
    if (!squad || !selectedSource || selectedSource.type !== 'reserves') return null;
    return squad.reserves.find((item) => item.id === selectedSource.itemId) || null;
  }, [squad, selectedSource]);

  const selectedSourceSlot = useMemo(() => {
    if (!squad || !selectedSource || selectedSource.type !== 'lineup') return null;
    return squad.lineup.find((slot) => slot.id === selectedSource.slotId) || null;
  }, [squad, selectedSource]);

  const selectedIncomingPlayer = useMemo(() => {
    if (selectedSource?.type === 'lineup' && selectedSourceSlot) {
      return players.find((player) => player.id === selectedSourceSlot.playerId) || null;
    }

    if (selectedSource?.type === 'bench' && selectedBenchItem?.playerId) {
      return players.find((player) => player.id === selectedBenchItem.playerId) || null;
    }

    if (selectedSource?.type === 'reserves' && selectedReserveItem?.playerId) {
      return players.find((player) => player.id === selectedReserveItem.playerId) || null;
    }

    return null;
  }, [
    players,
    selectedSource,
    selectedSourceSlot,
    selectedBenchItem,
    selectedReserveItem,
  ]);

  const compatibilityInfo = useMemo(() => {
    if (!selectedLineupSlot || !selectedIncomingPlayer) return null;

    const score = getPositionCompatibility(
      selectedIncomingPlayer,
      selectedLineupSlot.role,
    );

    return {
      score,
      level: getCompatibilityLevel(score),
      message: getCompatibilityMessage(
        selectedIncomingPlayer,
        selectedLineupSlot.role,
        score,
      ),
    };
  }, [selectedLineupSlot, selectedIncomingPlayer]);

  async function handleFormationChange(newFormation: string) {
    try {
      setLoading(true);
      const updatedSquad = await updateFormation(newFormation);
      setSquad(updatedSquad);
      setFormation(updatedSquad.formation);
      setSelectedLineupSlotId(null);
      setSelectedSource(null);
      await loadAiData();
    } catch (error) {
      console.error('Failed to update formation:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyChange() {
    if (!squad || !selectedLineupSlot || !selectedSource) return;

    try {
      setLoading(true);

      if (selectedSource.type === 'lineup') {
        const updatedSquad = await swapLineupPlayers(
          selectedLineupSlot.id,
          selectedSource.slotId,
        );
        setSquad(updatedSquad);
      } else {
        const updatedSquad = await replacePlayer(
          selectedLineupSlot.id,
          selectedSource.type,
          selectedSource.itemId,
        );
        setSquad(updatedSquad);
      }

      setSelectedLineupSlotId(null);
      setSelectedSource(null);
      await loadAiData();
    } catch (error) {
      console.error('Failed to apply squad change:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!squad) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Менеджер состава"
        subtitle="Смена схемы, перестановка игроков, замены и AI-анализ"
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Выбор схемы</h3>
            <p className="mt-1 text-sm text-slate-400">
              Сейчас выбрана схема: {formation}
            </p>
          </div>

          <FormationSelector value={formation} onChange={handleFormationChange} />
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Выбранный слот основы</p>
            <p className="mt-2 text-lg font-bold text-white">
              {selectedLineupSlot ? selectedLineupSlot.name : 'Не выбран'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {selectedLineupSlot
                ? `Роль в схеме: ${selectedLineupSlot.role}`
                : 'Нажми на игрока на поле'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Выбранный второй игрок</p>
            <p className="mt-2 text-lg font-bold text-white">
              {selectedIncomingPlayer ? selectedIncomingPlayer.name : 'Не выбран'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {selectedIncomingPlayer
                ? `Основная позиция: ${selectedIncomingPlayer.position}`
                : 'Выбери второго игрока'}
            </p>
          </div>

          <div
            className={`rounded-2xl p-4 ${
              compatibilityInfo?.level === 'good'
                ? 'bg-emerald-500/10'
                : compatibilityInfo?.level === 'warning'
                ? 'bg-amber-500/10'
                : compatibilityInfo?.level === 'bad'
                ? 'bg-rose-500/10'
                : 'bg-slate-950'
            }`}
          >
            <p className="text-sm text-slate-400">Совместимость</p>
            <p className="mt-2 text-lg font-bold text-white">
              {compatibilityInfo ? `${compatibilityInfo.score}%` : '—'}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {compatibilityInfo
                ? compatibilityInfo.message
                : 'Сначала выбери слот основы и второго игрока'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            onClick={handleApplyChange}
            disabled={!selectedLineupSlot || !selectedSource || loading}
          >
            {loading ? 'Сохранение...' : 'Применить изменение'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setSelectedLineupSlotId(null);
              setSelectedSource(null);
              setBenchOptions(null);
            }}
            disabled={loading}
          >
            Сбросить выбор
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <FootballField
            players={squad.lineup}
            selectedSlotId={selectedLineupSlotId}
            onSelectSlot={(slotId) => {
              if (!selectedLineupSlotId) {
                setSelectedLineupSlotId(slotId);
                setSelectedSource(null);
                return;
              }

              if (selectedLineupSlotId === slotId) {
                setSelectedLineupSlotId(null);
                setSelectedSource(null);
                return;
              }

              setSelectedSource({ type: 'lineup', slotId });
            }}
          />

          <BenchOptionsCard
            currentPlayerName={benchOptions?.currentPlayer?.name}
            options={benchOptions?.options ?? []}
          />
        </div>

        <div className="space-y-6">
          <RecommendationBox
            title={
              compatibilityInfo
                ? 'Рекомендация по выбранному действию'
                : squad.recommendation.title
            }
            message={
              compatibilityInfo
                ? compatibilityInfo.message
                : squad.recommendation.message
            }
            level={
              compatibilityInfo
                ? compatibilityInfo.level
                : squad.recommendation.level
            }
          />

          <BenchList
            title="Запасные"
            players={squad.bench}
            selectedItemId={
              selectedSource?.type === 'bench' ? selectedSource.itemId : null
            }
            onSelectItem={(itemId) => setSelectedSource({ type: 'bench', itemId })}
          />

          <BenchList
            title="Резервные"
            players={squad.reserves}
            selectedItemId={
              selectedSource?.type === 'reserves' ? selectedSource.itemId : null
            }
            onSelectItem={(itemId) =>
              setSelectedSource({ type: 'reserves', itemId })
            }
          />

          <RoleAlertsCard alerts={roleAlerts} />
        </div>
      </div>
    </div>
  );
}
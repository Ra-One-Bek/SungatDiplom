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
import { getSquad } from '../services/squad';
import {
  getSquadRecommendations,
  type SquadRecommendationsResponse,
} from '../services/ai';

import type { Player } from '../types/player';

type DragPayload =
  | { sourceType: 'lineup'; slotId: number }
  | { sourceType: 'bench' | 'reserves'; itemId: number };

type SetPiecesType = {
  penalty: number | null;
  freeKick: number | null;
  corner: number | null;
  captain: number | null;
};

export default function SquadManager() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<any>(null);
  const [formation, setFormation] = useState('4-3-3');

  const [aiSummary, setAiSummary] =
    useState<SquadRecommendationsResponse | null>(null);

  const [setPieces, setSetPieces] = useState<SetPiecesType>({
    penalty: null,
    freeKick: null,
    corner: null,
    captain: null,
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedBenchId, setSelectedBenchId] = useState<number | null>(null);

  // 🔥 Загрузка данных
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

  // 🔥 Helpers
  function getPlayer(id: number | null) {
    return players.find((p) => p.id === id);
  }

  function updateSetPiece(key: keyof SetPiecesType, playerId: number) {
    setSetPieces((prev) => ({
      ...prev,
      [key]: playerId,
    }));
  }

  // 🔥 AI авто состав
  function buildAutoLineup() {
    if (!squad) return;

    const best = [...players]
      .sort((a, b) => (b.form ?? 0) - (a.form ?? 0))
      .slice(0, squad.lineup.length);

    const updated = squad.lineup.map((slot: any, i: number) => ({
      ...slot,
      playerId: best[i]?.id ?? null,
      name: best[i]?.name ?? 'Empty',
    }));

    setSquad({ ...squad, lineup: updated });
  }

  // 🔥 swap игроков
  function swapSlots(slotA: number, slotB: number) {
    const a = squad.lineup.find((s: any) => s.id === slotA);
    const b = squad.lineup.find((s: any) => s.id === slotB);

    if (!a || !b) return;

    const updated = squad.lineup.map((slot: any) => {
      if (slot.id === slotA) return { ...slot, playerId: b.playerId, name: b.name };
      if (slot.id === slotB) return { ...slot, playerId: a.playerId, name: a.name };
      return slot;
    });

    setSquad({ ...squad, lineup: updated });
  }

  // 🔥 замена с bench/reserves
  function replaceFromList(payload: DragPayload, slotId: number) {
    if (payload.sourceType === 'lineup') return;

    const list =
      payload.sourceType === 'bench' ? squad.bench : squad.reserves;

    const player = list.find((i: any) => i.id === payload.itemId);
    if (!player) return;

    const updated = squad.lineup.map((slot: any) =>
      slot.id === slotId
        ? { ...slot, playerId: player.playerId, name: player.name }
        : slot,
    );

    setSquad({ ...squad, lineup: updated });
  }

  // 🔥 drag drop
  function handleDrop(slotId: number, raw: string) {
    try {
      const payload = JSON.parse(raw) as DragPayload;

      if (payload.sourceType === 'lineup') {
        swapSlots(slotId, payload.slotId);
      } else {
        replaceFromList(payload, slotId);
      }
    } catch (e) {
      console.error('Invalid drag payload');
    }
  }

  // 🔥 анализ
  const tacticalAdvice = useMemo(() => {
    if (!squad) return '';

    const weak = squad.lineup.filter((slot: any) => {
      const p = getPlayer(slot.playerId);
      return p && (p.form ?? 0) < 6.5;
    });

    if (weak.length >= 3) return 'Несколько игроков в плохой форме';
    if (weak.length >= 1) return 'Есть слабые позиции';

    return 'Состав выглядит сбалансированным';
  }, [squad, players]);

  if (!squad) return <p>Загрузка...</p>;

  return (
    <div className="space-y-8">
      <SectionTitle title="Squad Manager" subtitle="Drag & Drop + AI" />

      {aiSummary && (
        <AiSummaryCard
          totalPlayers={aiSummary.summary.totalPlayers}
          weakSpots={aiSummary.summary.weakSpots}
          readyPlayers={aiSummary.summary.readyPlayers}
          generalAdvice={aiSummary.generalAdvice}
        />
      )}

      <Card>
        <div className="flex justify-between">
          <FormationSelector value={formation} onChange={setFormation} />
          <Button onClick={buildAutoLineup}>AI состав</Button>
        </div>
      </Card>

      <Card>
        <RecommendationBox
          title="Анализ состава"
          message={tacticalAdvice}
          level="good"
        />
      </Card>

      <FootballField
        players={squad.lineup}
        selectedSlotId={selectedSlotId}
        onSelectSlot={setSelectedSlotId}
        onDropOnSlot={handleDrop}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <BenchList
          title="Запас"
          players={squad.bench}
          selectedItemId={selectedBenchId}
          onSelectItem={setSelectedBenchId}
        />

        <SetPiecesPanel
          players={players}
          setPieces={setPieces}
          onChange={updateSetPiece}
        />
      </div>
    </div>
  );
}
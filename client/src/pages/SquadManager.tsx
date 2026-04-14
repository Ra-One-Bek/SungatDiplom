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

import { getPlayers } from '../services/players';
import { getSquad } from '../services/squad';
import { getSquadRecommendations } from '../services/ai';

import type { Player } from '../types/player';

export default function SquadManager() {
  const { selectedClubId } = useSelectedClub();

  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<any>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [aiSummary, setAiSummary] = useState<any>(null);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // загрузка данных
  useEffect(() => {
    async function loadData() {
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
    }

    loadData();
  }, [selectedClubId]);

  // 🔥 авто состав
  function buildAutoLineup() {
    if (!squad) return;

    const best = [...players].sort((a, b) => b.form - a.form).slice(0, 11);

    const newLineup = squad.lineup.map((slot: any, index: number) => ({
      ...slot,
      playerId: best[index]?.id || null,
    }));

    setSquad({ ...squad, lineup: newLineup });
  }

  // 🔥 выбрать игрока в слот
  function assignPlayerToSlot() {
    if (!squad || !selectedSlotId || !selectedPlayerId) return;

    const newLineup = squad.lineup.map((slot: any) =>
      slot.id === selectedSlotId
        ? { ...slot, playerId: selectedPlayerId }
        : slot,
    );

    setSquad({ ...squad, lineup: newLineup });
  }

  // 🔥 фильтр по позиции
  const filteredPlayers = useMemo(() => {
    if (!selectedSlotId || !squad) return players;

    const slot = squad.lineup.find((s: any) => s.id === selectedSlotId);
    if (!slot) return players;

    return players
      .filter((p) => p.position === slot.role)
      .sort((a, b) => b.form - a.form);
  }, [players, selectedSlotId, squad]);

  // 🔥 анализ состава
  const tacticalAdvice = useMemo(() => {
    if (!squad) return '';

    const weak = squad.lineup.filter((slot: any) => {
      const p = players.find((pl) => pl.id === slot.playerId);
      return p && p.form < 6.5;
    });

    if (weak.length >= 3) {
      return 'Несколько игроков в слабой форме — сделайте ротацию';
    }

    return 'Состав выглядит сбалансированным';
  }, [squad, players]);

  if (!squad) {
    return <p className="text-slate-300">Загрузка...</p>;
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Менеджер состава"
        subtitle="Управление составом и AI анализ"
      />

      {/* AI SUMMARY */}
      {aiSummary && (
        <AiSummaryCard
          totalPlayers={aiSummary.summary.totalPlayers}
          weakSpots={aiSummary.summary.weakSpots}
          readyPlayers={aiSummary.summary.readyPlayers}
          generalAdvice={aiSummary.generalAdvice}
        />
      )}

      {/* FORMATION + AUTO */}
      <Card>
        <div className="flex justify-between items-center">
          <FormationSelector value={formation} onChange={setFormation} />

          <Button onClick={buildAutoLineup}>
            AI авто-состав
          </Button>
        </div>
      </Card>

      {/* ANALYSIS */}
      <Card>
        <RecommendationBox
          title="Анализ состава"
          message={tacticalAdvice}
          level="good"
        />
      </Card>

      {/* FIELD */}
      <FootballField
        players={squad.lineup}
        selectedSlotId={selectedSlotId}
        onSelectSlot={setSelectedSlotId}
      />

      {/* PLAYERS */}
      <Card>
        <h3 className="text-white font-bold mb-3">
          Выбор игрока
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {filteredPlayers.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlayerId(p.id)}
              className={`p-2 rounded-xl text-left ${
                selectedPlayerId === p.id
                  ? 'bg-blue-600'
                  : 'bg-slate-800'
              }`}
            >
              {p.name} ({p.position}) ⭐ {p.form}
            </button>
          ))}
        </div>

        <Button className="mt-3" onClick={assignPlayerToSlot}>
          Назначить в состав
        </Button>
      </Card>

      {/* BENCH */}
      <BenchList
        title="Скамейка"
        players={players}
        selectedItemId={null}
        onSelectItem={() => {}}
      />
    </div>
  );
}
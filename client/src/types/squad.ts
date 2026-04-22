import type { PlayerPosition } from './player';

export interface SquadPlayerSlot {
  id: number;
  playerId: number | null;
  name: string;
  role: PlayerPosition;
  top: string;
  left: string;
}

export interface BenchPlayer {
  id: number;
  playerId?: number | null;
  name: string;
  position: PlayerPosition;
}

export interface FormationOption {
  name: string;
}

export interface SquadRecommendation {
  title: string;
  message: string;
  level: 'good' | 'warning' | 'bad';
}

export interface SetPieces {
  penalty: number | null;
  freeKick: number | null;
  corner: number | null;
  captain: number | null;
}

export interface SquadData {
  formation: string;
  lineup: SquadPlayerSlot[];
  bench: BenchPlayer[];
  reserves: BenchPlayer[];
  recommendation?: SquadRecommendation;
  setPieces: SetPieces;
}
import { apiGet } from './api';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export type Formation = '4-3-3' | '4-4-2';

export interface SquadSlot {
  id: number;
  position: string;
  playerId: number | null;
}

export interface Squad {
  formation: Formation;
  lineup: SquadSlot[];
  bench: number[];
  setPieces: {
    penalty: number | null;
    freeKick: number | null;
    corner: number | null;
    captain: number | null;
  };
  
}

export async function getSquad(clubId: ClubId): Promise<Squad> {
  return apiGet(`/squad?clubId=${clubId}`);
}

import { apiGet, apiPatch } from './api';
import type { SquadData } from '../types/squad';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export async function getSquad(clubId: ClubId): Promise<SquadData> {
  return apiGet<SquadData>(`/squad?clubId=${clubId}`);
}

export async function updateFormation(
  formation: string,
  clubId: ClubId,
): Promise<SquadData> {
  return apiPatch<SquadData, { formation: string; clubId: ClubId }>(
    '/squad/formation',
    {
      formation,
      clubId,
    },
  );
}

export async function swapLineupPlayers(
  firstSlotId: number,
  secondSlotId: number,
  clubId: ClubId,
): Promise<SquadData> {
  return apiPatch<
    SquadData,
    { firstSlotId: number; secondSlotId: number; clubId: ClubId }
  >('/squad/swap-lineup', {
    firstSlotId,
    secondSlotId,
    clubId,
  });
}

export async function replacePlayer(
  lineupSlotId: number,
  sourceType: 'bench' | 'reserves',
  sourceItemId: number,
  clubId: ClubId,
): Promise<SquadData> {
  return apiPatch<
    SquadData,
    {
      lineupSlotId: number;
      sourceType: 'bench' | 'reserves';
      sourceItemId: number;
      clubId: ClubId;
    }
  >('/squad/replace', {
    lineupSlotId,
    sourceType,
    sourceItemId,
    clubId,
  });
}
import type { SquadData } from '../types/squad';
import { apiGet, apiPatch } from './api';

export async function getSquad(): Promise<SquadData> {
  return apiGet<SquadData>('/squad');
}

export async function updateFormation(formation: string): Promise<SquadData> {
  return apiPatch<SquadData, { formation: string }>('/squad/formation', {
    formation,
  });
}

export async function swapLineupPlayers(
  firstSlotId: number,
  secondSlotId: number,
): Promise<SquadData> {
  return apiPatch<SquadData, { firstSlotId: number; secondSlotId: number }>(
    '/squad/swap-lineup',
    {
      firstSlotId,
      secondSlotId,
    },
  );
}

export async function replacePlayer(
  lineupSlotId: number,
  sourceType: 'bench' | 'reserves',
  sourceItemId: number,
): Promise<SquadData> {
  return apiPatch<
    SquadData,
    {
      lineupSlotId: number;
      sourceType: 'bench' | 'reserves';
      sourceItemId: number;
    }
  >('/squad/replace', {
    lineupSlotId,
    sourceType,
    sourceItemId,
  });
}
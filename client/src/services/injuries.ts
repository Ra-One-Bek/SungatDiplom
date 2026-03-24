import { apiGet } from './api';

export interface InjuryItem {
  id: number;
  playerId: number | null;
  playerName: string;
  type: string;
  reason: string;
  fixtureId: number | null;
  fixtureDate: string | null;
  league: string | null;
  team: string | null;
  status: string;
}

export async function getInjuries(): Promise<InjuryItem[]> {
  return apiGet<InjuryItem[]>('/injuries');
}
import { apiGet } from './api';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export interface InjuryItem {
  id: number;
  playerName: string;
  type: string;
  reason: string;
  status: string;
  fixtureDate?: string;
  league?: string;
}

export async function getInjuries(clubId: ClubId): Promise<InjuryItem[]> {
  return apiGet(`/injuries?clubId=${clubId}`);
}
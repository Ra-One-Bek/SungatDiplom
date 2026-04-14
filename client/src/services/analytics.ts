import { apiGet } from './api';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export interface PlayerFormItem {
  playerId: number;
  name: string;
  position: string;
  number: number;
  image: string;
  nationality: string;
  rating: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  injured: boolean;
  formScore: number;
  availability: string;
  recommendation: string;
}

export async function getPlayersForm(clubId: ClubId): Promise<PlayerFormItem[]> {
  return apiGet<PlayerFormItem[]>(`/analytics/players-form?clubId=${clubId}`);
}

export async function getPlayerFormById(
  id: number,
  clubId: ClubId,
): Promise<PlayerFormItem> {
  return apiGet<PlayerFormItem>(`/analytics/players-form/${id}?clubId=${clubId}`);
}
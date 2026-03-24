import { apiGet } from './api';

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

export async function getPlayersForm(): Promise<PlayerFormItem[]> {
  return apiGet<PlayerFormItem[]>('/analytics/players-form');
}

export async function getPlayerFormById(id: number): Promise<PlayerFormItem> {
  return apiGet<PlayerFormItem>(`/analytics/players-form/${id}`);
}
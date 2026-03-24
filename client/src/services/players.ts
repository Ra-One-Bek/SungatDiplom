import type { Player } from '../types/player';
import { apiGet } from './api';

export async function getPlayers(): Promise<Player[]> {
  return apiGet<Player[]>('/players');
}

export async function getPlayerById(id: number): Promise<Player> {
  return apiGet<Player>(`/players/${id}`);
}
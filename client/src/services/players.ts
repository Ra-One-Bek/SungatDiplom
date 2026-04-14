import type { Player } from '../types/player';
import { apiGet } from './api';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export async function getPlayers(clubId: ClubId): Promise<Player[]> {
  return apiGet(`/players?clubId=${clubId}`);
}

export async function getPlayerById(
  id: number,
  clubId: ClubId,
): Promise<Player> {
  return apiGet(`/players/${id}?clubId=${clubId}`);
}
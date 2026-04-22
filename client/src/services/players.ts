import { apiGet } from './api';
import type { Player } from '../types/player';

export function getPlayers(clubId: string) {
  return apiGet<Player[]>(`/players?clubId=${clubId}`);
}

export function getPlayerById(playerId: string, clubId: string) {
  return apiGet<Player>(`/players/${playerId}?clubId=${clubId}`);
}
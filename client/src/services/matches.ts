import { apiGet } from './api';

export interface MatchItem {
  id: number;
  date: string;
  opponent: string;
  competition: string;
  home: boolean;
  status: string;
  score: {
    home: number | null;
    away: number | null;
  };
  venue: string | null;
}

export async function getMatches(): Promise<MatchItem[]> {
  return apiGet<MatchItem[]>('/matches');
}
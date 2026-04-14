import { apiGet } from './api';

export type ClubId = 'astana' | 'kairat' | 'kaisar';

export interface MatchItem {
  id: number;
  opponent: string;
  competition: string;
  date: string;
  home: boolean;
  score: {
    home: number | null;
    away: number | null;
  };
  status: string;
  venue?: string;
}

export async function getMatches(clubId: ClubId): Promise<MatchItem[]> {
  return apiGet(`/matches?clubId=${clubId}`);
}
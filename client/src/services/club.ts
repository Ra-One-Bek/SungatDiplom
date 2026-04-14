import type { Club } from '../types/club';
import { apiGet } from './api';

export type SupportedClub = {
  id: 'astana' | 'kairat' | 'kaisar';
  name: string;
  shortName: string;
  league: string;
  season: number;
  teamId: number;
  leagueId: number;
  country: string;
  stadium?: string;
  founded?: number;
  logo?: string;
};

export async function getSupportedClubs(): Promise<SupportedClub[]> {
  return apiGet('/club/supported');
}

export async function getClub(clubId: 'astana' | 'kairat' | 'kaisar'): Promise<Club> {
  return apiGet(`/club?clubId=${clubId}`);
}
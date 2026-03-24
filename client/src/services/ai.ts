import { apiGet } from './api';

export interface SquadRecommendationItem {
  slotId: number;
  playerId: number;
  playerName: string;
  role: string;
  formScore: number;
  availability: string;
  injured: boolean;
  compatibility: number;
  advice: string;
}

export interface SquadRecommendationsResponse {
  formation: string;
  summary: {
    totalPlayers: number;
    weakSpots: number;
    readyPlayers: number;
  };
  lineupAnalysis: SquadRecommendationItem[];
  weakSpots: SquadRecommendationItem[];
  generalAdvice: string;
}

export interface BenchOptionItem {
  playerId: number;
  name: string;
  position: string;
  roleTarget: string;
  formScore: number;
  compatibility: number;
  finalRecommendationScore: number;
  injured: boolean;
  availability: string;
  advice: string;
}

export interface BenchOptionsResponse {
  slotId: number;
  currentPlayer: {
    playerId: number;
    name: string;
    role: string;
  };
  options: BenchOptionItem[];
}

export interface TrainingRecommendationItem {
  playerId: number;
  name: string;
  position: string;
  formScore: number;
  injured: boolean;
  focus: string;
  load: string;
  reason: string;
}

export interface RoleAlertItem {
  slotId: number;
  playerId: number;
  playerName: string;
  naturalPosition: string;
  assignedRole: string;
  compatibility: number;
  alertLevel: 'ok' | 'warning' | 'danger';
  message: string;
}

export async function getSquadRecommendations(): Promise<SquadRecommendationsResponse> {
  return apiGet<SquadRecommendationsResponse>('/ai/recommendations/squad');
}

export async function getBenchOptions(slotId: number): Promise<BenchOptionsResponse> {
  return apiGet<BenchOptionsResponse>(`/ai/recommendations/bench-options/${slotId}`);
}

export async function getTrainingRecommendations(): Promise<TrainingRecommendationItem[]> {
  return apiGet<TrainingRecommendationItem[]>('/ai/recommendations/training');
}

export async function getRoleAlerts(): Promise<RoleAlertItem[]> {
  return apiGet<RoleAlertItem[]>('/ai/recommendations/role-alerts');
}
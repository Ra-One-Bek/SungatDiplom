export interface ClubStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  averagePossession: number;
}

export type MatchResult = 'win' | 'draw' | 'loss';

export interface RecentMatch {
  id: number;
  opponent: string;
  competition: string;
  date: string;
  score: string;
  result: MatchResult;
}

export interface TopScorer {
  playerId: number;
  name: string;
  goals: number;
}

export interface ClubInfo {
  name: string;
  country: string;
  stadium: string;
  coach: string;
  founded: number;
  logo: string;
}

export interface Club {
  info: ClubInfo;
  stats: ClubStats;
  recentMatches: RecentMatch[];
  topScorers: TopScorer[];
}
import type { Club } from '../types/club';

export const clubMock: Club = {
  info: {
    name: 'Atletico de Madrid',
    country: 'Spain',
    stadium: 'Cívitas Metropolitano',
    coach: 'Diego Simeone',
    founded: 1903,
    logo: 'https://via.placeholder.com/120x120.png?text=ATM',
  },
  stats: {
    matchesPlayed: 32,
    wins: 20,
    draws: 7,
    losses: 5,
    goalsScored: 58,
    goalsConceded: 29,
    cleanSheets: 13,
    averagePossession: 52,
  },
  recentMatches: [
    {
      id: 1,
      opponent: 'Barcelona',
      competition: 'La Liga',
      date: '2026-03-10',
      score: '2 - 1',
      result: 'win',
    },
    {
      id: 2,
      opponent: 'Sevilla',
      competition: 'La Liga',
      date: '2026-03-06',
      score: '1 - 1',
      result: 'draw',
    },
    {
      id: 3,
      opponent: 'Real Sociedad',
      competition: 'Copa del Rey',
      date: '2026-03-02',
      score: '0 - 1',
      result: 'loss',
    },
    {
      id: 4,
      opponent: 'Valencia',
      competition: 'La Liga',
      date: '2026-02-25',
      score: '3 - 0',
      result: 'win',
    },
  ],
  topScorers: [
    { playerId: 8, name: 'Antoine Griezmann', goals: 16 },
    { playerId: 9, name: 'Álvaro Morata', goals: 14 },
    { playerId: 10, name: 'Samuel Lino', goals: 7 },
  ],
};
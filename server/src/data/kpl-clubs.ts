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

export const KPL_CLUBS: SupportedClub[] = [
  {
    id: 'astana',
    name: 'FC Astana',
    shortName: 'AST',
    league: 'Kazakhstan Premier League',
    season: 2024,
    teamId: 562,
    leagueId: 389,
    country: 'Kazakhstan',
    stadium: 'Astana Arena',
    founded: 2009,
    logo: 'https://media.api-sports.io/football/teams/562.png',
  },
  {
    id: 'kairat',
    name: 'Kairat Almaty',
    shortName: 'KAI',
    league: 'Kazakhstan Premier League',
    season: 2024,
    teamId: 664,
    leagueId: 389,
    country: 'Kazakhstan',
    stadium: 'Ortalyq stadion',
    founded: 1952,
    logo: 'https://media.api-sports.io/football/teams/664.png',
  },
  {
    id: 'kaisar',
    name: 'Kaisar',
    shortName: 'KSR',
    league: 'Kazakhstan Premier League',
    season: 2024,
    teamId: 4562,
    leagueId: 389,
    country: 'Kazakhstan',
    stadium: 'Stadion im. Gany Muratbaeva',
    founded: 1968,
    logo: 'https://media.api-sports.io/football/teams/4562.png',
  },
];
export type PlayerSource = 'api' | 'admin' | 'hybrid';

export type PlayerPosition =
  | 'Goalkeeper'
  | 'Defender'
  | 'Midfielder'
  | 'Attacker'
  | 'Forward'
  | 'Unknown';

export type PlayerStats = {
  appearances: number;
  lineups: number;
  minutes: number;
  rating: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export type PlayerSourceMeta = {
  source: PlayerSource;
  externalPlayerId: number | null;
  localPlayerId: number | null;
  overridden: boolean;
  hiddenByAdmin: boolean;
};

export type Player = {
  id: string;
  externalPlayerId: number | null;
  localPlayerId: number | null;

  name: string;
  firstname: string;
  lastname: string;

  age: number;
  number: number;
  position: string;
  nationality: string;

  photo: string;
  image: string;

  form: number;
  stats: PlayerStats;

  source: PlayerSource;
  sourceMeta: PlayerSourceMeta;

  adminNote: string | null;
};
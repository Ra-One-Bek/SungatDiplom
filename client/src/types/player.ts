export type PlayerPosition =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST';

export type InjuryStatus = 'fit' | 'doubtful' | 'injured' | 'suspended';

export interface PlayerStats {
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  age: number;
  nationality: string;
  image: string;
  position: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  form: number;
  injuryStatus: InjuryStatus;
  stats: PlayerStats;
  attributes: PlayerAttributes;
}
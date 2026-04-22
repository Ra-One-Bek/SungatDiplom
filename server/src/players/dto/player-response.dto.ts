export type PlayerSource = 'api' | 'admin' | 'hybrid';

export type PlayerStatsDto = {
  appearances: number;
  lineups: number;
  minutes: number;
  rating: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export type PlayerSourceMetaDto = {
  source: PlayerSource;
  externalPlayerId: number | null;
  localPlayerId: number | null;
  overridden: boolean;
  hiddenByAdmin: boolean;
};

export class PlayerResponseDto {
  id!: string;
  externalPlayerId!: number | null;
  localPlayerId!: number | null;

  name!: string;
  firstname!: string;
  lastname!: string;

  age!: number;
  number!: number;
  position!: string;
  nationality!: string;

  photo!: string;
  image!: string;

  form!: number;
  stats!: PlayerStatsDto;

  source!: PlayerSource;
  sourceMeta!: PlayerSourceMetaDto;

  adminNote!: string | null;
}
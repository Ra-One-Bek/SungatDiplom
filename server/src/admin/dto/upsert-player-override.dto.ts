import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpsertPlayerOverrideDto {
  @IsInt()
  externalPlayerId!: number;

  @IsString()
  clubId!: string;

  @IsOptional()
  @IsString()
  customName?: string;

  @IsOptional()
  @IsInt()
  customNumber?: number;

  @IsOptional()
  @IsString()
  customPosition?: string;

  @IsOptional()
  @IsString()
  customNationality?: string;

  @IsOptional()
  @IsString()
  customPhoto?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
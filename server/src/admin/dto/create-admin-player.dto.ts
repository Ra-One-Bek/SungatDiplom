import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAdminPlayerDto {
  @IsString()
  clubId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsInt()
  @Min(14)
  @Max(60)
  age?: number;

  @IsOptional()
  @IsInt()
  number?: number;

  @IsString()
  position!: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
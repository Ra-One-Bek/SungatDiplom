import { IsIn, IsOptional } from 'class-validator';

export class GetClubQueryDto {
  @IsOptional()
  @IsIn(['astana', 'kairat', 'kaisar'])
  clubId?: 'astana' | 'kairat' | 'kaisar';
}
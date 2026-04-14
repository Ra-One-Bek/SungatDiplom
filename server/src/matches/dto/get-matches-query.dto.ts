import { IsIn, IsOptional } from 'class-validator';

export class GetMatchesQueryDto {
  @IsOptional()
  @IsIn(['astana', 'kairat', 'kaisar'])
  clubId?: 'astana' | 'kairat' | 'kaisar';
}
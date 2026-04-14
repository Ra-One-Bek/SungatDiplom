import { IsIn, IsOptional } from 'class-validator';

export class GetPlayersQueryDto {
  @IsOptional()
  @IsIn(['astana', 'kairat', 'kaisar'])
  clubId?: 'astana' | 'kairat' | 'kaisar';
}
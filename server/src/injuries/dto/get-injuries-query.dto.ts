import { IsIn, IsOptional } from 'class-validator';

export class GetInjuriesQueryDto {
  @IsOptional()
  @IsIn(['astana', 'kairat', 'kaisar'])
  clubId?: 'astana' | 'kairat' | 'kaisar';
}
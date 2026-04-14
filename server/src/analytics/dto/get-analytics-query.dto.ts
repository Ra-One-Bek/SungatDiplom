import { IsIn, IsOptional } from 'class-validator';

export class GetAnalyticsQueryDto {
  @IsOptional()
  @IsIn(['astana', 'kairat', 'kaisar'])
  clubId?: 'astana' | 'kairat' | 'kaisar';
}
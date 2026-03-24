import { IsIn, IsInt } from 'class-validator';

export class ReplacePlayerDto {
  @IsInt()
  lineupSlotId: number;

  @IsIn(['bench', 'reserves'])
  sourceType: 'bench' | 'reserves';

  @IsInt()
  sourceItemId: number;
}
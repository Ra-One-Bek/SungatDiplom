import { IsInt } from 'class-validator';

export class SwapLineupDto {
  @IsInt()
  firstSlotId: number;

  @IsInt()
  secondSlotId: number;
}
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SquadService } from './squad.service';
import { UpdateFormationDto } from './dto/update-formation.dto';
import { SwapLineupDto } from './dto/swap-lineup.dto';
import { ReplacePlayerDto } from './dto/replace-player.dto';

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @Get()
  getSquad() {
    return this.squadService.getSquad();
  }

  @Patch('formation')
  updateFormation(@Body() dto: UpdateFormationDto) {
    return this.squadService.updateFormation(dto.formation);
  }

  @Patch('swap-lineup')
  swapLineup(@Body() dto: SwapLineupDto) {
    return this.squadService.swapLineupPlayers(dto.firstSlotId, dto.secondSlotId);
  }

  @Patch('replace')
  replacePlayer(@Body() dto: ReplacePlayerDto) {
    return this.squadService.replacePlayer(
      dto.lineupSlotId,
      dto.sourceType,
      dto.sourceItemId,
    );
  }
}
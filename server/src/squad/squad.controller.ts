import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { SquadService } from './squad.service';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  // 🔥 получить состав
  @Get()
  getSquad(@Query('clubId') clubId: ClubId = 'astana') {
    return this.squadService.getSquad(clubId);
  }

  // 🔥 смена схемы
  @Patch('formation')
  updateFormation(
    @Body()
    body: {
      formation: string;
      clubId?: ClubId;
    },
  ) {
    return this.squadService.updateFormation(
      body.formation,
      body.clubId ?? 'astana',
    );
  }

  // 🔥 swap игроков
  @Patch('swap-lineup')
  swapLineupPlayers(
    @Body()
    body: {
      firstSlotId: number;
      secondSlotId: number;
      clubId?: ClubId;
    },
  ) {
    return this.squadService.swapLineupPlayers(
      body.firstSlotId,
      body.secondSlotId,
      body.clubId ?? 'astana',
    );
  }

  // 🔥 замена игрока
  @Patch('replace')
  replacePlayer(
    @Body()
    body: {
      lineupSlotId: number;
      sourceType: 'bench' | 'reserves';
      sourceItemId: number;
      clubId?: ClubId;
    },
  ) {
    return this.squadService.replacePlayer(
      body.lineupSlotId,
      body.sourceType,
      body.sourceItemId,
      body.clubId ?? 'astana',
    );
  }
}
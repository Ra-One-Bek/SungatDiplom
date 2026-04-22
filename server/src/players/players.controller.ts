import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query('clubId') clubId?: 'astana' | 'kairat' | 'kaisar') {
    return this.playersService.findAll(clubId ?? 'astana');
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('clubId') clubId?: 'astana' | 'kairat' | 'kaisar',
  ) {
    return this.playersService.findOne(id, clubId ?? 'astana');
  }
}
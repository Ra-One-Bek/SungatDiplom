import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { GetPlayersQueryDto } from './dto/get-players-query.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query() query: GetPlayersQueryDto) {
    return this.playersService.findAll(query.clubId ?? 'astana');
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetPlayersQueryDto,
  ) {
    return this.playersService.findOne(id, query.clubId ?? 'astana');
  }
}
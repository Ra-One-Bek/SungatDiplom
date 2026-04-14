import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClubService } from './club.service';
import { GetClubQueryDto } from './dto/get-club-query.dto';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get('supported')
  findAllSupportedClubs() {
    return this.clubService.findAllSupportedClubs();
  }

  @Get()
  findClub(@Query() query: GetClubQueryDto) {
    return this.clubService.findClub(query.clubId ?? 'astana');
  }

  @Get(':clubId')
  findClubByParam(@Param('clubId') clubId: string) {
    return this.clubService.findClub(clubId);
  }

  @Get('debug/teams/:name')
  debugSearchTeams(@Param('name') name: string) {
    return this.clubService.debugSearchTeams(name);
  }

  @Get('debug/leagues/:name')
  debugSearchLeagues(@Param('name') name: string) {
    return this.clubService.debugSearchLeagues(name);
  }
}
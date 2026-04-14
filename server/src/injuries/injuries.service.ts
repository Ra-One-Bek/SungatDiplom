import { Injectable } from '@nestjs/common';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS } from '../data/kpl-clubs';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Injectable()
export class InjuriesService {
  constructor(
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  async findAll(clubId: ClubId = 'astana') {
    const club = KPL_CLUBS.find((c) => c.id === clubId);

    if (!club) return [];

    const injuries = await this.externalFootballService.getInjuries(
      club.teamId,
      club.season,
      club.leagueId,
    );

    return injuries.map((item: any) => this.mapInjury(item));
  }

  private mapInjury(item: any) {
    const player = item.player ?? {};
    const injury = item.injury ?? {};
    const fixture = item.fixture ?? {};
    const league = item.league ?? {};

    return {
      id: player.id,
      playerName: player.name,
      type: injury.type,
      reason: injury.reason,
      status: injury.status,
      fixtureDate: fixture.date,
      league: league.name,
    };
  }
}
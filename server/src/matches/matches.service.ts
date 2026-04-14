import { Injectable } from '@nestjs/common';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS } from '../data/kpl-clubs';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Injectable()
export class MatchesService {
  constructor(
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  async findAll(clubId: ClubId = 'astana') {
    const club = KPL_CLUBS.find((c) => c.id === clubId);

    if (!club) return [];

    const fixtures = await this.externalFootballService.getFixturesByTeam(
      club.teamId,
      club.season,
      club.leagueId,
    );

    return fixtures.map((item: any) => this.mapMatch(item));
  }

  private mapMatch(item: any) {
    const fixture = item.fixture ?? {};
    const teams = item.teams ?? {};
    const goals = item.goals ?? {};
    const league = item.league ?? {};

    return {
      id: fixture.id,
      opponent: teams.home?.name,
      competition: league.name,
      date: fixture.date,
      home: true,
      score: {
        home: goals.home,
        away: goals.away,
      },
      status: fixture.status?.long ?? 'Unknown',
      venue: fixture.venue?.name,
    };
  }
}
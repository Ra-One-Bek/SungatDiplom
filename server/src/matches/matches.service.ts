import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalFootballService } from '../external-football/external-football.service';

@Injectable()
export class MatchesService {
  private readonly teamId: number;
  private readonly season: number;
  private readonly leagueId: number;

  constructor(
    private readonly externalFootballService: ExternalFootballService,
    private readonly configService: ConfigService,
  ) {
    this.teamId = Number(this.configService.get('ATLETICO_TEAM_ID'));
    this.season = Number(this.configService.get('CURRENT_SEASON'));
    this.leagueId = Number(this.configService.get('LA_LIGA_ID'));
  }

  async findAll() {
    const fixtures = await this.externalFootballService.getFixturesByTeam(
      this.teamId,
      this.season,
      this.leagueId,
    );

    return fixtures.map((fixture: any) => {
      const isHome = fixture.teams.home.id === this.teamId;
      const opponent = isHome ? fixture.teams.away.name : fixture.teams.home.name;

      return {
        id: fixture.fixture.id,
        date: fixture.fixture.date,
        opponent,
        competition: fixture.league.name,
        home: isHome,
        status: fixture.fixture.status.short,
        score: {
          home: fixture.goals.home,
          away: fixture.goals.away,
        },
        venue: fixture.fixture.venue?.name ?? null,
      };
    });
  }
}
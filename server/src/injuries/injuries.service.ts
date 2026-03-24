import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalFootballService } from '../external-football/external-football.service';

@Injectable()
export class InjuriesService {
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
    const injuries = await this.externalFootballService.getInjuries(
      this.teamId,
      this.season,
      this.leagueId,
    );

    return injuries.map((item: any) => ({
      id: item.player?.id ?? item.fixture?.id ?? Math.random(),
      playerId: item.player?.id ?? null,
      playerName: item.player?.name ?? 'Unknown Player',
      type: item.player?.type ?? item.injury?.type ?? 'Unknown',
      reason: item.player?.reason ?? item.injury?.reason ?? 'Unknown',
      fixtureId: item.fixture?.id ?? null,
      fixtureDate: item.fixture?.date ?? null,
      league: item.league?.name ?? null,
      team: item.team?.name ?? null,
      status: 'injured',
    }));
  }
}
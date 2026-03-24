import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ExternalFootballService {
  private readonly api: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('API_FOOTBALL_BASE_URL');
    const apiKey = this.configService.get<string>('API_FOOTBALL_KEY');

    if (!baseURL || !apiKey) {
      throw new InternalServerErrorException(
        'API_FOOTBALL_BASE_URL or API_FOOTBALL_KEY is missing in .env',
      );
    }

    this.api = axios.create({
      baseURL,
      headers: {
        'x-apisports-key': apiKey,
      },
    });
  }

  async getTeams(teamId: number) {
    const response = await this.api.get('/teams', {
      params: { id: teamId },
    });

    return response.data?.response ?? [];
  }

  async getPlayersByTeam(teamId: number, season: number, page = 1) {
    const response = await this.api.get('/players', {
      params: {
        team: teamId,
        season,
        page,
      },
    });

    return response.data;
  }

  async getPlayerStatistics(playerId: number, teamId: number, season: number) {
    const response = await this.api.get('/players', {
      params: {
        id: playerId,
        team: teamId,
        season,
      },
    });

    return response.data?.response ?? [];
  }

  async getFixturesByTeam(teamId: number, season: number, league?: number) {
    const response = await this.api.get('/fixtures', {
      params: {
        team: teamId,
        season,
        ...(league ? { league } : {}),
      },
    });

    return response.data?.response ?? [];
  }

  async getInjuries(teamId: number, season: number, league?: number) {
    const response = await this.api.get('/injuries', {
      params: {
        team: teamId,
        season,
        ...(league ? { league } : {}),
      },
    });

    return response.data?.response ?? [];
  }

  async getStandings(league: number, season: number) {
    const response = await this.api.get('/standings', {
      params: { league, season },
    });

    return response.data?.response ?? [];
  }
}
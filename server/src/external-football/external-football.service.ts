import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';

type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

@Injectable()
export class ExternalFootballService {
  private readonly api: AxiosInstance;
  private readonly logger = new Logger(ExternalFootballService.name);

  private readonly cache = new Map<string, CacheEntry<any>>();

  // TTL можно потом подправить
  private readonly ttlMs = {
    teams: 1000 * 60 * 60 * 12, // 12 часов
    players: 1000 * 60 * 30, // 30 минут
    fixtures: 1000 * 60 * 10, // 10 минут
    injuries: 1000 * 60 * 10, // 10 минут
    standings: 1000 * 60 * 10, // 10 минут
    search: 1000 * 60 * 60, // 1 час
  };

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
      timeout: 5000,
      headers: {
        'x-apisports-key': apiKey,
      },
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private getStaleCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? (entry.data as T) : null;
  }

  private setCache<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async requestWithCache<T>(
    cacheKey: string,
    ttl: number,
    url: string,
    params: Record<string, unknown>,
    fallbackValue: T,
  ): Promise<T> {
    const cached = this.getCache<T>(cacheKey);
    if (cached !== null) {
      this.logger.debug(`CACHE HIT: ${cacheKey}`);
      return cached;
    }

    try {
      const response = await this.api.get(url, { params });
      const data = response.data as T;

      this.setCache(cacheKey, data, ttl);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status;
      const retryAfterHeader = axiosError.response?.headers?.['retry-after'];
      const retryAfterSeconds = retryAfterHeader
        ? Number(retryAfterHeader)
        : null;

      if (status === 429) {
        this.logger.warn(
          `RATE LIMIT for ${cacheKey}. retry-after=${retryAfterSeconds ?? 'unknown'}s`,
        );

        // если есть старые данные в кеше — используем их
        const stale = this.getStaleCache<T>(cacheKey);
        if (stale !== null) {
          this.logger.warn(`Using stale cache for ${cacheKey}`);
          return stale;
        }

        // одна попытка подождать и повторить
        if (retryAfterSeconds && retryAfterSeconds > 0 && retryAfterSeconds <= 20) {
          await this.delay(retryAfterSeconds * 1000);

          try {
            const retryResponse = await this.api.get(url, { params });
            const retryData = retryResponse.data as T;
            this.setCache(cacheKey, retryData, ttl);
            return retryData;
          } catch (retryError) {
            this.logger.warn(`Retry failed for ${cacheKey}`);
          }
        }

        return fallbackValue;
      }

      this.logger.error(
        `External API request failed for ${cacheKey}: ${axiosError.message}`,
      );

      const stale = this.getStaleCache<T>(cacheKey);
      if (stale !== null) {
        this.logger.warn(`Using stale cache after error for ${cacheKey}`);
        return stale;
      }

      return fallbackValue;
    }
  }

  async getTeams(teamId: number) {
    const cacheKey = `teams:${teamId}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.teams,
      '/teams',
      { id: teamId },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async getPlayersByTeam(teamId: number, season: number, page = 1) {
    const cacheKey = `players:${teamId}:${season}:${page}`;

    return this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.players,
      '/players',
      { team: teamId, season, page },
      {
        get: '',
        parameters: [],
        errors: {
          cacheFallback: 'Rate limit or external API error',
        },
        results: 0,
        paging: {
          current: page,
          total: page,
        },
        response: [],
      },
    );
  }

  async getPlayerStatistics(playerId: number, teamId: number, season: number) {
    const cacheKey = `player-stats:${playerId}:${teamId}:${season}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.players,
      '/players',
      { id: playerId, team: teamId, season },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async getFixturesByTeam(teamId: number, season: number, league?: number) {
    const cacheKey = `fixtures:${teamId}:${season}:${league ?? 'all'}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.fixtures,
      '/fixtures',
      {
        team: teamId,
        season,
        ...(league ? { league } : {}),
      },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async getInjuries(teamId: number, season: number, league?: number) {
    const cacheKey = `injuries:${teamId}:${season}:${league ?? 'all'}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.injuries,
      '/injuries',
      {
        team: teamId,
        season,
        ...(league ? { league } : {}),
      },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async getStandings(league: number, season: number) {
    const cacheKey = `standings:${league}:${season}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.standings,
      '/standings',
      { league, season },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async searchTeams(name: string) {
    const cacheKey = `search-teams:${name.toLowerCase()}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.search,
      '/teams',
      { search: name },
      { response: [] },
    );

    return data?.response ?? [];
  }

  async searchLeagues(name: string) {
    const cacheKey = `search-leagues:${name.toLowerCase()}`;

    const data = await this.requestWithCache<any>(
      cacheKey,
      this.ttlMs.search,
      '/leagues',
      { search: name },
      { response: [] },
    );

    return data?.response ?? [];
  }
}
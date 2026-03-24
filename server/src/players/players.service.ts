import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalFootballService } from '../external-football/external-football.service';

type NormalizedPlayer = {
  id: number;
  name: string;
  number: number;
  age: number;
  nationality: string;
  image: string;
  position: string;
  secondaryPositions: string[];
  form: number;
  injuryStatus: string;
  stats: {
    appearances: number;
    minutes: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    rating: number;
  };
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
};

@Injectable()
export class PlayersService {
  private readonly teamId: number;
  private readonly season: number;

  private cachedPlayers: NormalizedPlayer[] | null = null;
  private cacheExpiresAt = 0;

  constructor(
    private readonly externalFootballService: ExternalFootballService,
    private readonly configService: ConfigService,
  ) {
    this.teamId = Number(this.configService.get('ATLETICO_TEAM_ID'));
    this.season = Number(this.configService.get('CURRENT_SEASON'));
  }

  private normalizePosition(position?: string): string {
    if (!position) return 'CM';

    const value = position.toLowerCase();

    if (value.includes('goal')) return 'GK';
    if (value.includes('defender')) return 'CB';
    if (value.includes('back')) return 'CB';
    if (value.includes('midfielder')) return 'CM';
    if (value.includes('winger')) return 'RW';
    if (value.includes('attacker')) return 'ST';
    if (value.includes('forward')) return 'ST';

    if (value === 'gk') return 'GK';
    if (value === 'df') return 'CB';
    if (value === 'mf') return 'CM';
    if (value === 'fw') return 'ST';

    return position.toUpperCase();
  }

  private mapPlayer(item: any): NormalizedPlayer {
    const player = item.player;
    const stats = item.statistics?.[0];

    return {
      id: player.id,
      name: player.name,
      number: stats?.games?.number ?? 0,
      age: player.age ?? 0,
      nationality: player.nationality ?? 'Unknown',
      image: player.photo ?? '',
      position: this.normalizePosition(stats?.games?.position),
      secondaryPositions: [],
      form: stats?.games?.rating ? Number(stats.games.rating) * 10 : 0,
      injuryStatus: 'fit',
      stats: {
        appearances: stats?.games?.appearences ?? 0,
        minutes: stats?.games?.minutes ?? 0,
        goals: stats?.goals?.total ?? 0,
        assists: stats?.goals?.assists ?? 0,
        yellowCards: stats?.cards?.yellow ?? 0,
        redCards: stats?.cards?.red ?? 0,
        rating: stats?.games?.rating ? Number(stats.games.rating) : 0,
      },
      attributes: {
        pace: 0,
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defending: 0,
        physical: 0,
      },
    };
  }

  private getMockPlayers(): NormalizedPlayer[] {
    return [
      {
        id: 154,
        name: 'Antoine Griezmann',
        number: 7,
        age: 34,
        nationality: 'France',
        image: 'https://media.api-sports.io/football/players/154.png',
        position: 'ST',
        secondaryPositions: [],
        form: 85,
        injuryStatus: 'fit',
        stats: {
          appearances: 30,
          minutes: 2500,
          goals: 15,
          assists: 7,
          yellowCards: 2,
          redCards: 0,
          rating: 7.8,
        },
        attributes: {
          pace: 80,
          shooting: 85,
          passing: 82,
          dribbling: 88,
          defending: 40,
          physical: 75,
        },
      },
      {
        id: 192,
        name: 'Jan Oblak',
        number: 13,
        age: 32,
        nationality: 'Slovenia',
        image: 'https://media.api-sports.io/football/players/192.png',
        position: 'GK',
        secondaryPositions: [],
        form: 82,
        injuryStatus: 'fit',
        stats: {
          appearances: 31,
          minutes: 2790,
          goals: 0,
          assists: 0,
          yellowCards: 1,
          redCards: 0,
          rating: 7.3,
        },
        attributes: {
          pace: 0,
          shooting: 0,
          passing: 0,
          dribbling: 0,
          defending: 0,
          physical: 0,
        },
      },
      {
        id: 2937,
        name: 'Koke',
        number: 6,
        age: 33,
        nationality: 'Spain',
        image: 'https://media.api-sports.io/football/players/2937.png',
        position: 'CM',
        secondaryPositions: [],
        form: 78,
        injuryStatus: 'fit',
        stats: {
          appearances: 28,
          minutes: 2200,
          goals: 2,
          assists: 5,
          yellowCards: 6,
          redCards: 0,
          rating: 7.2,
        },
        attributes: {
          pace: 0,
          shooting: 0,
          passing: 0,
          dribbling: 0,
          defending: 0,
          physical: 0,
        },
      },
      {
        id: 278,
        name: 'José María Giménez',
        number: 2,
        age: 30,
        nationality: 'Uruguay',
        image: 'https://media.api-sports.io/football/players/278.png',
        position: 'CB',
        secondaryPositions: [],
        form: 77,
        injuryStatus: 'fit',
        stats: {
          appearances: 24,
          minutes: 2100,
          goals: 2,
          assists: 1,
          yellowCards: 5,
          redCards: 0,
          rating: 7.1,
        },
        attributes: {
          pace: 0,
          shooting: 0,
          passing: 0,
          dribbling: 0,
          defending: 0,
          physical: 0,
        },
      },
      {
        id: 1460,
        name: 'Rodrigo De Paul',
        number: 5,
        age: 30,
        nationality: 'Argentina',
        image: 'https://media.api-sports.io/football/players/1460.png',
        position: 'CM',
        secondaryPositions: [],
        form: 80,
        injuryStatus: 'fit',
        stats: {
          appearances: 29,
          minutes: 2350,
          goals: 3,
          assists: 6,
          yellowCards: 7,
          redCards: 0,
          rating: 7.4,
        },
        attributes: {
          pace: 0,
          shooting: 0,
          passing: 0,
          dribbling: 0,
          defending: 0,
          physical: 0,
        },
      },
    ];
  }

  async findAll(): Promise<NormalizedPlayer[]> {
    const now = Date.now();

    if (this.cachedPlayers && now < this.cacheExpiresAt) {
      return this.cachedPlayers;
    }

    try {
      const firstPage = await this.externalFootballService.getPlayersByTeam(
        this.teamId,
        this.season,
        1,
      );

      const paging = firstPage?.paging;
      const pages = Number(paging?.total || 1);

      let allPlayers = [...(firstPage?.response ?? [])];

      for (let page = 2; page <= pages; page += 1) {
        const nextPage = await this.externalFootballService.getPlayersByTeam(
          this.teamId,
          this.season,
          page,
        );

        allPlayers = allPlayers.concat(nextPage?.response ?? []);
      }

      if (!allPlayers.length) {
        console.warn('API returned empty players list, using fallback mock data');
        const fallbackPlayers = this.getMockPlayers();
        this.cachedPlayers = fallbackPlayers;
        this.cacheExpiresAt = now + 1000 * 60 * 5;
        return fallbackPlayers;
      }

      const normalizedPlayers = allPlayers.map((item: any) => this.mapPlayer(item));

      this.cachedPlayers = normalizedPlayers;
      this.cacheExpiresAt = now + 1000 * 60 * 5;

      return normalizedPlayers;
    } catch (error) {
      console.error('Failed to fetch players from external API, using fallback mock data', error);

      const fallbackPlayers = this.getMockPlayers();
      this.cachedPlayers = fallbackPlayers;
      this.cacheExpiresAt = now + 1000 * 60 * 5;

      return fallbackPlayers;
    }
  }

  async findOne(id: number): Promise<NormalizedPlayer> {
    const players = await this.findAll();
    const player = players.find((item) => item.id === id);

    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return player;
  }

  clearCache() {
    this.cachedPlayers = null;
    this.cacheExpiresAt = 0;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS } from '../data/kpl-clubs';
import { playersMock } from '../data/players.mock';
import { PlayerResponseDto } from './dto/player-response.dto';

type ClubId = 'astana' | 'kairat' | 'kaisar';

type ApiMappedPlayer = {
  id: number;
  externalPlayerId: number;
  localPlayerId: null;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  number: number;
  position: string;
  nationality: string;
  photo: string;
  image: string;
  form: number;
  stats: {
    appearances: number;
    lineups: number;
    minutes: number;
    rating: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
};

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  async findAll(clubId: ClubId = 'astana'): Promise<PlayerResponseDto[]> {
    const club = KPL_CLUBS.find((item) => item.id === clubId);

    if (!club) {
      throw new NotFoundException(`Club with id "${clubId}" not found`);
    }

    const apiPlayersRaw = await this.fetchAllPlayersForClub(club.teamId, club.season);

    const apiPlayers: ApiMappedPlayer[] = apiPlayersRaw.length
      ? apiPlayersRaw.map((item: unknown) => this.mapApiPlayer(item))
      : this.getMockPlayers(clubId);

    const overrides = await this.prisma.playerOverride.findMany({
      where: { clubId },
    });

    const localPlayers = await this.prisma.adminPlayer.findMany({
      where: { clubId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const overridesMap = new Map(
      overrides.map((item) => [`${item.externalPlayerId}:${item.clubId}`, item]),
    );

    const mergedApiPlayers: PlayerResponseDto[] = apiPlayers
      .map((player) => {
        const override = overridesMap.get(`${player.externalPlayerId}:${clubId}`);

        if (!override) {
          return this.buildApiPlayerResponse(player);
        }

        if (override.isHidden) {
          return null;
        }

        return this.buildHybridPlayerResponse(player, override);
      })
      .filter((player): player is PlayerResponseDto => player !== null);

    const mappedLocalPlayers: PlayerResponseDto[] = localPlayers.map((player) =>
      this.buildAdminPlayerResponse(player),
    );

    const result = [...mappedLocalPlayers, ...mergedApiPlayers];

    return this.sortPlayers(result);
  }

  async findOne(playerId: string, clubId: ClubId = 'astana'): Promise<PlayerResponseDto> {
    const players = await this.findAll(clubId);

    const player = players.find((item) => item.id === playerId);

    if (!player) {
      throw new NotFoundException(
        `Player with id "${playerId}" not found for club "${clubId}"`,
      );
    }

    return player;
  }

  private async fetchAllPlayersForClub(teamId: number, season: number): Promise<unknown[]> {
    const pages = [1, 2, 3, 4];
    let allPlayers: unknown[] = [];

    for (const page of pages) {
      const result = await this.externalFootballService.getPlayersByTeam(
        teamId,
        season,
        page,
      );

      const pageResponse = Array.isArray(result)
        ? result
        : Array.isArray((result as { response?: unknown[] })?.response)
          ? ((result as { response: unknown[] }).response ?? [])
          : [];

      if (pageResponse.length === 0) {
        break;
      }

      allPlayers = [...allPlayers, ...pageResponse];
    }

    return allPlayers;
  }

  private getMockPlayers(clubId: ClubId): ApiMappedPlayer[] {
    const mockPlayers = playersMock[clubId] || [];

    return mockPlayers.map((player) => ({
      id: player.id,
      externalPlayerId: player.id,
      localPlayerId: null,
      name: player.name ?? '',
      firstname: '',
      lastname: '',
      age: player.age ?? 0,
      number: player.number ?? 0,
      position: player.position ?? 'Unknown',
      nationality: player.nationality ?? 'Unknown',
      photo: player.image ?? '',
      image: player.image ?? '',
      form: player.form ?? 0,
      stats: {
        appearances: player.stats?.appearances ?? 0,
        lineups: player.stats?.appearances ?? 0,
        minutes: player.stats?.minutes ?? 0,
        rating: player.stats?.rating ?? 0,
        goals: player.stats?.goals ?? 0,
        assists: player.stats?.assists ?? 0,
        yellowCards: player.stats?.yellowCards ?? 0,
        redCards: player.stats?.redCards ?? 0,
      },
    }));
  }

  private mapApiPlayer(item: unknown): ApiMappedPlayer {
    const safeItem = item as {
      player?: {
        id?: number;
        name?: string;
        firstname?: string;
        lastname?: string;
        age?: number;
        nationality?: string;
        photo?: string;
      };
      statistics?: Array<{
        games?: {
          number?: number;
          position?: string;
          appearences?: number;
          lineups?: number;
          minutes?: number;
          rating?: string | number;
        };
        goals?: {
          total?: number;
          assists?: number;
        };
        cards?: {
          yellow?: number;
          red?: number;
        };
      }>;
    };

    const player = safeItem.player ?? {};
    const statistics = safeItem.statistics?.[0] ?? {};
    const games = statistics.games ?? {};
    const goals = statistics.goals ?? {};
    const cards = statistics.cards ?? {};

    return {
      id: player.id ?? 0,
      externalPlayerId: player.id ?? 0,
      localPlayerId: null,
      name: player.name ?? '',
      firstname: player.firstname ?? '',
      lastname: player.lastname ?? '',
      age: player.age ?? 0,
      number: games.number ?? 0,
      position: games.position ?? 'Unknown',
      nationality: player.nationality ?? 'Unknown',
      photo: player.photo ?? '',
      image: player.photo ?? '',
      form: games.rating ? Number(games.rating) : 0,
      stats: {
        appearances: games.appearences ?? 0,
        lineups: games.lineups ?? 0,
        minutes: games.minutes ?? 0,
        rating: games.rating ? Number(games.rating) : 0,
        goals: goals.total ?? 0,
        assists: goals.assists ?? 0,
        yellowCards: cards.yellow ?? 0,
        redCards: cards.red ?? 0,
      },
    };
  }

  private buildApiPlayerResponse(player: ApiMappedPlayer): PlayerResponseDto {
    return {
      id: `api-${player.externalPlayerId}`,
      externalPlayerId: player.externalPlayerId,
      localPlayerId: null,
      name: player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      number: player.number,
      position: player.position,
      nationality: player.nationality,
      photo: player.photo,
      image: player.image,
      form: player.form,
      stats: player.stats,
      source: 'api',
      sourceMeta: {
        source: 'api',
        externalPlayerId: player.externalPlayerId,
        localPlayerId: null,
        overridden: false,
        hiddenByAdmin: false,
      },
      adminNote: null,
    };
  }

  private buildHybridPlayerResponse(
    player: ApiMappedPlayer,
    override: {
      customName: string | null;
      customNumber: number | null;
      customPosition: string | null;
      customNationality: string | null;
      customPhoto: string | null;
      note: string | null;
      externalPlayerId: number;
      isHidden: boolean;
    },
  ): PlayerResponseDto {
    return {
      id: `api-${player.externalPlayerId}`,
      externalPlayerId: player.externalPlayerId,
      localPlayerId: null,
      name: override.customName ?? player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      number: override.customNumber ?? player.number,
      position: override.customPosition ?? player.position,
      nationality: override.customNationality ?? player.nationality,
      photo: override.customPhoto ?? player.photo,
      image: override.customPhoto ?? player.image,
      form: player.form,
      stats: player.stats,
      source: 'hybrid',
      sourceMeta: {
        source: 'hybrid',
        externalPlayerId: player.externalPlayerId,
        localPlayerId: null,
        overridden: true,
        hiddenByAdmin: false,
      },
      adminNote: override.note ?? null,
    };
  }

  private buildAdminPlayerResponse(player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    number: number | null;
    position: string;
    nationality: string | null;
    photo: string | null;
  }): PlayerResponseDto {
    return {
      id: `admin-${player.id}`,
      externalPlayerId: null,
      localPlayerId: player.id,
      name: player.name,
      firstname: player.firstname ?? '',
      lastname: player.lastname ?? '',
      age: player.age ?? 0,
      number: player.number ?? 0,
      position: player.position,
      nationality: player.nationality ?? 'Unknown',
      photo: player.photo ?? '',
      image: player.photo ?? '',
      form: 0,
      stats: {
        appearances: 0,
        lineups: 0,
        minutes: 0,
        rating: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
      source: 'admin',
      sourceMeta: {
        source: 'admin',
        externalPlayerId: null,
        localPlayerId: player.id,
        overridden: false,
        hiddenByAdmin: false,
      },
      adminNote: null,
    };
  }

  private sortPlayers(players: PlayerResponseDto[]): PlayerResponseDto[] {
    const positionOrder: Record<string, number> = {
      Goalkeeper: 1,
      Defender: 2,
      Midfielder: 3,
      Attacker: 4,
      Forward: 4,
      Unknown: 99,
    };

    return [...players].sort((a, b) => {
      const positionA = positionOrder[a.position] ?? 50;
      const positionB = positionOrder[b.position] ?? 50;

      if (positionA !== positionB) {
        return positionA - positionB;
      }

      if (a.number !== b.number) {
        return a.number - b.number;
      }

      return a.name.localeCompare(b.name);
    });
  }
}
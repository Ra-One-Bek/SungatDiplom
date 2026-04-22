import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS } from '../data/kpl-clubs';
import { playersMock } from '../data/players.mock';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  async findAll(clubId: ClubId = 'astana') {
    const club = KPL_CLUBS.find((item) => item.id === clubId);

    if (!club) {
      throw new NotFoundException(`Club with id "${clubId}" not found`);
    }

    // 🔹 1. Получаем игроков из API
    const apiPlayersRaw = await this.fetchAllPlayersForClub(
      club.teamId,
      club.season,
    );

    const apiPlayers = apiPlayersRaw.length
      ? apiPlayersRaw.map((item: any) => this.mapApiPlayer(item))
      : this.getMockPlayers(clubId);

    // 🔹 2. Получаем overrides
    const overrides = await this.prisma.playerOverride.findMany({
      where: { clubId },
    });

    // 🔹 3. Получаем локальных игроков
    const localPlayers = await this.prisma.adminPlayer.findMany({
      where: { clubId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // 🔹 4. Map для быстрого поиска override
    const overridesMap = new Map(
      overrides.map((o) => [`${o.externalPlayerId}:${o.clubId}`, o]),
    );

    // 🔹 5. Merge API + overrides
    const mergedApiPlayers = apiPlayers
      .map((player) => {
        const override = overridesMap.get(
          `${player.externalPlayerId}:${clubId}`,
        );

        if (!override) {
          return {
            ...player,
            id: `api-${player.externalPlayerId}`,
            source: 'api',
            sourceMeta: {
              externalPlayerId: player.externalPlayerId,
              localPlayerId: null,
              overridden: false,
              hiddenByAdmin: false,
            },
            adminNote: null,
          };
        }

        // скрыт админом
        if (override.isHidden) {
          return null;
        }

        return {
          ...player,
          id: `api-${player.externalPlayerId}`,
          name: override.customName ?? player.name,
          number: override.customNumber ?? player.number,
          position: override.customPosition ?? player.position,
          nationality: override.customNationality ?? player.nationality,
          photo: override.customPhoto ?? player.photo,
          image: override.customPhoto ?? player.image,
          source: 'hybrid',
          sourceMeta: {
            externalPlayerId: player.externalPlayerId,
            localPlayerId: null,
            overridden: true,
            hiddenByAdmin: false,
          },
          adminNote: override.note ?? null,
        };
      })
      .filter(Boolean);

    // 🔹 6. Маппим локальных игроков
    const mappedLocalPlayers = localPlayers.map((player) => ({
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
        externalPlayerId: null,
        localPlayerId: player.id,
        overridden: false,
        hiddenByAdmin: false,
      },

      adminNote: null,
    }));

    return [...mappedLocalPlayers, ...mergedApiPlayers];
  }

  async findOne(playerId: string, clubId: ClubId = 'astana') {
    const players = await this.findAll(clubId);

    const player = players.find((p) => p.id === playerId);

    if (!player) {
      throw new NotFoundException(
        `Player ${playerId} not found for club ${clubId}`,
      );
    }

    return player;
  }

  private async fetchAllPlayersForClub(teamId: number, season: number) {
    const pages = [1, 2, 3, 4];
    let allPlayers: any[] = [];

    for (const page of pages) {
      const result = await this.externalFootballService.getPlayersByTeam(
        teamId,
        season,
        page,
      );

      const data = Array.isArray(result)
        ? result
        : result?.response ?? [];

      if (!data.length) break;

      allPlayers = [...allPlayers, ...data];
    }

    return allPlayers;
  }

  private getMockPlayers(clubId: ClubId) {
    const mock = playersMock[clubId] || [];

    return mock.map((p: any) => ({
      id: p.id,
      externalPlayerId: p.id,
      localPlayerId: null,
      name: p.name,
      firstname: '',
      lastname: '',
      age: p.age ?? 0,
      number: p.number ?? 0,
      position: p.position,
      nationality: p.nationality ?? 'Unknown',
      photo: p.image ?? '',
      image: p.image ?? '',
      form: p.form ?? 0,
      stats: {
        appearances: p.stats?.appearances ?? 0,
        lineups: p.stats?.appearances ?? 0,
        minutes: p.stats?.minutes ?? 0,
        rating: p.stats?.rating ?? 0,
        goals: p.stats?.goals ?? 0,
        assists: p.stats?.assists ?? 0,
        yellowCards: p.stats?.yellowCards ?? 0,
        redCards: p.stats?.redCards ?? 0,
      },
    }));
  }

  private mapApiPlayer(item: any) {
    const player = item.player ?? {};
    const statistics = item.statistics?.[0] ?? {};
    const games = statistics.games ?? {};
    const goals = statistics.goals ?? {};
    const cards = statistics.cards ?? {};

    return {
      externalPlayerId: player.id,
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
}
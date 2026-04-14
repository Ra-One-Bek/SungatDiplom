import { Injectable, NotFoundException } from '@nestjs/common';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS } from '../data/kpl-clubs';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Injectable()
export class PlayersService {
  constructor(
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  async findAll(clubId: ClubId = 'astana') {
    const club = KPL_CLUBS.find((item) => item.id === clubId);

    if (!club) {
      throw new NotFoundException(`Club with id "${clubId}" not found`);
    }

    const playersResponse = await this.fetchAllPlayersForClub(club.teamId, club.season);

    return playersResponse.map((item: any) => this.mapPlayer(item));
  }

  async findOne(playerId: number, clubId: ClubId = 'astana') {
    const club = KPL_CLUBS.find((item) => item.id === clubId);

    if (!club) {
      throw new NotFoundException(`Club with id "${clubId}" not found`);
    }

    const playersResponse = await this.fetchAllPlayersForClub(club.teamId, club.season);

    const player = playersResponse.find(
      (item: any) => item.player?.id === playerId,
    );

    if (!player) {
      throw new NotFoundException(
        `Player with id "${playerId}" not found for club "${clubId}"`,
      );
    }

    return this.mapPlayer(player);
  }

  private async fetchAllPlayersForClub(teamId: number, season: number) {
    const pages = [1, 2, 3, 4];
    let allPlayers: any[] = [];

    console.log('FETCH PLAYERS =>', { teamId, season });

    for (const page of pages) {
      const result = await this.externalFootballService.getPlayersByTeam(
        teamId,
        season,
        page,
      );

      console.log(`PLAYERS RAW RESULT PAGE ${page}:`, JSON.stringify(result, null, 2));

      const pageResponse = Array.isArray(result)
        ? result
        : Array.isArray(result?.response)
          ? result.response
          : [];

      console.log(`PLAYERS PAGE ${page} COUNT:`, pageResponse.length);

      if (pageResponse.length === 0) {
        break;
      }

      allPlayers = [...allPlayers, ...pageResponse];
    }

    console.log('TOTAL PLAYERS COUNT:', allPlayers.length);

    return allPlayers;
  }

  private mapPlayer(item: any) {
    const player = item.player ?? {};
    const statistics = item.statistics?.[0] ?? {};
    const games = statistics.games ?? {};
    const goals = statistics.goals ?? {};
    const cards = statistics.cards ?? {};

    return {
      id: player.id,
      name: player.name ?? '',
      firstname: player.firstname ?? '',
      lastname: player.lastname ?? '',
      age: player.age ?? 0,
      number: games.number ?? 0,
      position: games.position ?? 'Unknown',
      nationality: player.nationality ?? 'Unknown',
      photo: player.photo ?? '',
      image: player.photo ?? '',
      form: statistics.games?.rating ? Number(statistics.games.rating) : 0,
      stats: {
        appearances: games.appearences ?? 0,
        lineups: games.lineups ?? 0,
        minutes: games.minutes ?? 0,
        rating: statistics.games?.rating ? Number(statistics.games.rating) : 0,
        goals: goals.total ?? 0,
        assists: goals.assists ?? 0,
        yellowCards: cards.yellow ?? 0,
        redCards: cards.red ?? 0,
      },
    };
  }
}
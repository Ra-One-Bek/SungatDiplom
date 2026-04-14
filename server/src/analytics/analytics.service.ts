import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayersService } from '../players/players.service';

type ClubId = 'astana' | 'kairat' | 'kaisar';

@Injectable()
export class AnalyticsService {
  constructor(private readonly playersService: PlayersService) {}

  async getPlayersForm(clubId: ClubId = 'astana') {
    const players = await this.playersService.findAll(clubId);

    return players.map((player: any) => this.mapPlayerForm(player));
  }

  async getPlayerFormById(playerId: number, clubId: ClubId = 'astana') {
    const players = await this.playersService.findAll(clubId);

    const player = players.find((item: any) => item.id === playerId);

    if (!player) {
      throw new NotFoundException(
        `Player with id "${playerId}" not found for club "${clubId}"`,
      );
    }

    return this.mapPlayerForm(player);
  }

  private mapPlayerForm(player: any) {
    const stats = player.stats ?? {};

    const goals = Number(stats.goals ?? 0);
    const assists = Number(stats.assists ?? 0);
    const rating = Number(stats.rating ?? 0);
    const minutes = Number(stats.minutes ?? 0);
    const yellowCards = Number(stats.yellowCards ?? 0);
    const redCards = Number(stats.redCards ?? 0);

    const formScore = this.calculateFormScore({
      goals,
      assists,
      rating,
      minutes,
      yellowCards,
      redCards,
    });

    return {
      playerId: player.id,
      name: player.name,
      position: player.position,
      number: player.number,
      image: player.image,
      nationality: player.nationality,
      rating,
      minutes,
      goals,
      assists,
      yellowCards,
      redCards,
      injured: false,
      formScore,
      availability: this.getAvailability(minutes),
      recommendation: this.getRecommendation(formScore, player.position, minutes),
    };
  }

  private calculateFormScore(input: {
    goals: number;
    assists: number;
    rating: number;
    minutes: number;
    yellowCards: number;
    redCards: number;
  }) {
    const {
      goals,
      assists,
      rating,
      minutes,
      yellowCards,
      redCards,
    } = input;

    const normalizedRating = rating > 0 ? rating : 6.5;
    const minuteFactor = Math.min(minutes / 100, 20);

    const rawScore =
      goals * 4 +
      assists * 3 +
      normalizedRating * 2 +
      minuteFactor -
      yellowCards * 0.5 -
      redCards * 2;

    return Math.max(0, Math.round(rawScore));
  }

  private getAvailability(minutes: number) {
    if (minutes >= 1400) {
      return 'Основной игрок';
    }

    if (minutes >= 500) {
      return 'Игрок ротации';
    }

    if (minutes > 0) {
      return 'Редко играет';
    }

    return 'Почти не используется';
  }

  private getRecommendation(
    formScore: number,
    position: string,
    minutes: number,
  ) {
    if (formScore >= 40 && minutes >= 900) {
      return `Игрок в хорошей форме. Рекомендуется как сильный вариант для основы на позиции ${position}.`;
    }

    if (formScore >= 25) {
      return `Игрок выглядит полезно. Можно активно использовать в ротации на позиции ${position}.`;
    }

    if (minutes === 0) {
      return `Игрок почти не получал игровое время. Нужна дополнительная оценка на тренировках.`;
    }

    return `Форма игрока пока неубедительная. Стоит осторожно использовать его в ближайших матчах.`;
  }
}
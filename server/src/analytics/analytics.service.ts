import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { InjuriesService } from '../injuries/injuries.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly playersService: PlayersService,
    private readonly injuriesService: InjuriesService,
  ) {}

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private normalizeMinutes(minutes: number): number {
    return this.clamp((minutes / 3000) * 100, 0, 100);
  }

  private normalizeGoals(goals: number): number {
    return this.clamp(goals * 6, 0, 100);
  }

  private normalizeAssists(assists: number): number {
    return this.clamp(assists * 8, 0, 100);
  }

  private normalizeRating(rating: number): number {
    return this.clamp((rating / 10) * 100, 0, 100);
  }

  private getCardPenalty(yellowCards: number, redCards: number): number {
    return yellowCards * 1.5 + redCards * 8;
  }

  private getInjuryPenalty(isInjured: boolean): number {
    return isInjured ? 18 : 0;
  }

  private getAvailability(isInjured: boolean, formScore: number): string {
    if (isInjured) return 'unavailable';
    if (formScore >= 80) return 'ready';
    if (formScore >= 60) return 'available';
    return 'needs-attention';
  }
  private cachedPlayersForm: any[] | null = null;
  private cacheExpiresAt = 0;

  private getRecommendation(
    isInjured: boolean,
    formScore: number,
    position: string,
  ): string {
    if (isInjured) {
      return 'Игрок не должен выходить в стартовом составе до восстановления.';
    }

    if (formScore >= 85) {
      return `Игрок в отличной форме. Рекомендуется использовать в основе на позиции ${position}.`;
    }

    if (formScore >= 70) {
      return `Игрок в хорошей форме. Можно использовать в основе или как важную часть ротации на позиции ${position}.`;
    }

    if (formScore >= 55) {
      return `Форма игрока средняя. Лучше использовать аккуратно и контролировать нагрузку.`;
    }

    return `Форма игрока низкая. Желательно снизить нагрузку и рассмотреть индивидуальную тренировочную программу.`;
  }

  private calculateForm(player: any, injuries: any[]) {
    const isInjured = injuries.some(
      (injury) => injury.playerId === player.id,
    );

    const ratingScore = this.normalizeRating(player.stats.rating || 0);
    const minutesScore = this.normalizeMinutes(player.stats.minutes || 0);
    const goalsScore = this.normalizeGoals(player.stats.goals || 0);
    const assistsScore = this.normalizeAssists(player.stats.assists || 0);
    const cardPenalty = this.getCardPenalty(
      player.stats.yellowCards || 0,
      player.stats.redCards || 0,
    );
    const injuryPenalty = this.getInjuryPenalty(isInjured);

    const rawScore =
      ratingScore * 0.45 +
      minutesScore * 0.2 +
      goalsScore * 0.18 +
      assistsScore * 0.12 -
      cardPenalty -
      injuryPenalty;

    const formScore = Math.round(this.clamp(rawScore, 0, 100));

    return {
      playerId: player.id,
      name: player.name,
      position: player.position,
      number: player.number,
      image: player.image,
      nationality: player.nationality,
      rating: player.stats.rating,
      minutes: player.stats.minutes,
      goals: player.stats.goals,
      assists: player.stats.assists,
      yellowCards: player.stats.yellowCards,
      redCards: player.stats.redCards,
      injured: isInjured,
      formScore,
      availability: this.getAvailability(isInjured, formScore),
      recommendation: this.getRecommendation(isInjured, formScore, player.position),
    };
  }
  

  async getPlayersForm() {
    const now = Date.now();

    if (this.cachedPlayersForm && now < this.cacheExpiresAt) {
        return this.cachedPlayersForm;
    }

    const [players, injuries] = await Promise.all([
        this.playersService.findAll(),
        this.injuriesService.findAll().catch(() => []),
    ]);

    const result = players
        .map((player) => this.calculateForm(player, injuries))
        .sort((a, b) => b.formScore - a.formScore);

    this.cachedPlayersForm = result;
    this.cacheExpiresAt = now + 1000 * 60 * 5;

    return result;
    }

  async getPlayerFormById(id: number) {
    const [players, injuries] = await Promise.all([
      this.playersService.findAll(),
      this.injuriesService.findAll().catch(() => []),
    ]);

    const player = players.find((item) => item.id === id);

    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return this.calculateForm(player, injuries);
  }
}
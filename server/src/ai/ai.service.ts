import { Injectable } from '@nestjs/common';
import { AnalyticsService } from '../analytics/analytics.service';
import { SquadService } from '../squad/squad.service';
import { PlayersService } from '../players/players.service';

@Injectable()
export class AiService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly squadService: SquadService,
    private readonly playersService: PlayersService,
  ) {}

  private getPositionCompatibility(position: string, targetRole: string): number {
    if (position === targetRole) return 100;

    const defense = ['CB', 'LB', 'RB'];
    const midfield = ['CDM', 'CM', 'CAM', 'LM', 'RM'];
    const attack = ['LW', 'RW', 'ST'];

    if (position === 'GK' && targetRole !== 'GK') return 5;
    if (position !== 'GK' && targetRole === 'GK') return 5;

    if (defense.includes(position) && defense.includes(targetRole)) return 65;
    if (midfield.includes(position) && midfield.includes(targetRole)) return 65;
    if (attack.includes(position) && attack.includes(targetRole)) return 65;

    if (
      (midfield.includes(position) && attack.includes(targetRole)) ||
      (attack.includes(position) && midfield.includes(targetRole))
    ) {
      return 45;
    }

    if (
      (midfield.includes(position) && defense.includes(targetRole)) ||
      (defense.includes(position) && midfield.includes(targetRole))
    ) {
      return 40;
    }

    if (
      (defense.includes(position) && attack.includes(targetRole)) ||
      (attack.includes(position) && defense.includes(targetRole))
    ) {
      return 20;
    }

    return 25;
  }

  private getRoleAdvice(position: string, targetRole: string, compatibility: number): string {
    if (compatibility >= 85) {
      return `Игрок отлично подходит под роль ${targetRole}.`;
    }

    if (compatibility >= 65) {
      return `Игрок может уверенно сыграть в роли ${targetRole}.`;
    }

    if (compatibility >= 45) {
      return `Игрок частично подходит для роли ${targetRole}, но это не идеальный вариант.`;
    }

    if (position === 'GK' && targetRole !== 'GK') {
      return `Вратаря не рекомендуется использовать в роли ${targetRole}.`;
    }

    return `Игрок плохо подходит под роль ${targetRole}.`;
  }

  async getSquadRecommendations() {
    const [forms, squad] = await Promise.all([
      this.analyticsService.getPlayersForm(),
      this.squadService.getSquad(),
    ]);

    const currentLineupAnalysis = squad.lineup.map((slot: any) => {
      const player = forms.find((item) => item.playerId === slot.playerId);
      const compatibility = player
        ? this.getPositionCompatibility(player.position, slot.role)
        : 0;

      return {
        slotId: slot.id,
        playerId: slot.playerId,
        playerName: slot.name,
        role: slot.role,
        formScore: player?.formScore ?? 0,
        availability: player?.availability ?? 'unknown',
        injured: player?.injured ?? false,
        compatibility,
        advice: player
          ? this.getRoleAdvice(player.position, slot.role, compatibility)
          : 'Нет данных по игроку.',
      };
    });

    const weakSpots = currentLineupAnalysis.filter(
      (item) => item.formScore < 60 || item.compatibility < 50 || item.injured,
    );

    return {
      formation: squad.formation,
      summary: {
        totalPlayers: currentLineupAnalysis.length,
        weakSpots: weakSpots.length,
        readyPlayers: currentLineupAnalysis.filter(
          (item) => item.availability === 'ready' || item.availability === 'available',
        ).length,
      },
      lineupAnalysis: currentLineupAnalysis,
      weakSpots,
      generalAdvice:
        weakSpots.length > 0
          ? 'В составе есть уязвимые позиции. Рекомендуется проверить слабые зоны и варианты замены.'
          : 'Текущий состав выглядит сбалансированным.',
    };
  }

  async getBenchOptionsForSlot(slotId: number) {
    const [forms, squad] = await Promise.all([
      this.analyticsService.getPlayersForm(),
      this.squadService.getSquad(),
    ]);

    const targetSlot = squad.lineup.find((slot: any) => slot.id === slotId);

    if (!targetSlot) {
      return {
        slotId,
        options: [],
        message: 'Слот не найден.',
      };
    }

    const candidateIds = [
      ...squad.bench.map((item: any) => item.playerId),
      ...squad.reserves.map((item: any) => item.playerId),
    ];

    const options = forms
      .filter((player) => candidateIds.includes(player.playerId))
      .map((player) => {
        const compatibility = this.getPositionCompatibility(
          player.position,
          targetSlot.role,
        );

        const finalScore = Math.round(player.formScore * 0.7 + compatibility * 0.3);

        return {
          playerId: player.playerId,
          name: player.name,
          position: player.position,
          roleTarget: targetSlot.role,
          formScore: player.formScore,
          compatibility,
          finalRecommendationScore: finalScore,
          injured: player.injured,
          availability: player.availability,
          advice: this.getRoleAdvice(player.position, targetSlot.role, compatibility),
        };
      })
      .sort((a, b) => b.finalRecommendationScore - a.finalRecommendationScore);

    return {
      slotId,
      currentPlayer: {
        playerId: targetSlot.playerId,
        name: targetSlot.name,
        role: targetSlot.role,
      },
      options,
    };
  }

  async getTrainingRecommendations() {
    const forms = await this.analyticsService.getPlayersForm();

    const recommendations = forms.map((player) => {
      let focus = 'Поддерживающая тренировка';
      let reason = 'Игрок находится в стабильном состоянии.';
      let load = 'medium';

      if (player.injured) {
        focus = 'Восстановление';
        reason = 'Игрок травмирован и должен пройти восстановительный цикл.';
        load = 'low';
      } else if (player.formScore >= 85) {
        focus = 'Поддержание формы';
        reason = 'Игрок в отличной форме, важно не перегрузить.';
        load = 'medium';
      } else if (player.formScore >= 70) {
        focus = 'Развитие игровых качеств';
        reason = 'Игрок в хорошей форме и может прибавить за счет профильных нагрузок.';
        load = 'medium';
      } else if (player.formScore >= 55) {
        focus = 'Индивидуальная работа';
        reason = 'Форма средняя, желательно скорректировать тренировочную программу.';
        load = 'medium-high';
      } else {
        focus = 'Функциональное восстановление и базовая подготовка';
        reason = 'Игрок показывает низкую форму, стоит снизить давление и улучшить базовые показатели.';
        load = 'low-medium';
      }

      return {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        formScore: player.formScore,
        injured: player.injured,
        focus,
        load,
        reason,
      };
    });

    return recommendations;
  }

  async getRoleAlerts() {
    const [forms, squad] = await Promise.all([
      this.analyticsService.getPlayersForm(),
      this.squadService.getSquad(),
    ]);

    return squad.lineup
      .map((slot: any) => {
        const player = forms.find((item) => item.playerId === slot.playerId);

        if (!player) return null;

        const compatibility = this.getPositionCompatibility(player.position, slot.role);

        return {
          slotId: slot.id,
          playerId: player.playerId,
          playerName: player.name,
          naturalPosition: player.position,
          assignedRole: slot.role,
          compatibility,
          alertLevel:
            compatibility >= 70 ? 'ok' : compatibility >= 45 ? 'warning' : 'danger',
          message: this.getRoleAdvice(player.position, slot.role, compatibility),
        };
      })
      .filter(Boolean);
  }
}
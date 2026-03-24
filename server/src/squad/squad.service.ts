import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { squadMock } from '../data/squad.mock';

type FormationTemplate = {
  role: string;
  top: string;
  left: string;
};

@Injectable()
export class SquadService {
  private squad = structuredClone(squadMock);

  private formationTemplates: Record<string, FormationTemplate[]> = {
    '4-3-3': [
      { role: 'GK', top: '90%', left: '50%' },
      { role: 'RB', top: '74%', left: '82%' },
      { role: 'CB', top: '77%', left: '62%' },
      { role: 'CB', top: '77%', left: '38%' },
      { role: 'LB', top: '74%', left: '18%' },
      { role: 'CM', top: '58%', left: '50%' },
      { role: 'CM', top: '61%', left: '68%' },
      { role: 'CM', top: '61%', left: '32%' },
      { role: 'LW', top: '30%', left: '20%' },
      { role: 'ST', top: '20%', left: '50%' },
      { role: 'RW', top: '30%', left: '80%' },
    ],
    '4-4-2': [
      { role: 'GK', top: '90%', left: '50%' },
      { role: 'RB', top: '74%', left: '82%' },
      { role: 'CB', top: '77%', left: '62%' },
      { role: 'CB', top: '77%', left: '38%' },
      { role: 'LB', top: '74%', left: '18%' },
      { role: 'RM', top: '54%', left: '82%' },
      { role: 'CM', top: '58%', left: '60%' },
      { role: 'CM', top: '58%', left: '40%' },
      { role: 'LM', top: '54%', left: '18%' },
      { role: 'ST', top: '24%', left: '40%' },
      { role: 'ST', top: '24%', left: '60%' },
    ],
    '3-5-2': [
      { role: 'GK', top: '90%', left: '50%' },
      { role: 'CB', top: '76%', left: '50%' },
      { role: 'CB', top: '78%', left: '32%' },
      { role: 'CB', top: '78%', left: '68%' },
      { role: 'LM', top: '52%', left: '16%' },
      { role: 'CM', top: '58%', left: '38%' },
      { role: 'CM', top: '56%', left: '50%' },
      { role: 'CM', top: '58%', left: '62%' },
      { role: 'RM', top: '52%', left: '84%' },
      { role: 'ST', top: '24%', left: '42%' },
      { role: 'ST', top: '24%', left: '58%' },
    ],
    '4-2-3-1': [
      { role: 'GK', top: '90%', left: '50%' },
      { role: 'RB', top: '74%', left: '82%' },
      { role: 'CB', top: '77%', left: '62%' },
      { role: 'CB', top: '77%', left: '38%' },
      { role: 'LB', top: '74%', left: '18%' },
      { role: 'CDM', top: '61%', left: '42%' },
      { role: 'CDM', top: '61%', left: '58%' },
      { role: 'LW', top: '36%', left: '20%' },
      { role: 'CAM', top: '41%', left: '50%' },
      { role: 'RW', top: '36%', left: '80%' },
      { role: 'ST', top: '20%', left: '50%' },
    ],
  };

  getSquad() {
    return this.squad;
  }

  updateFormation(formation: string) {
    const template = this.formationTemplates[formation];

    if (!template) {
      throw new BadRequestException('Unsupported formation');
    }

    this.squad.formation = formation;
    this.squad.lineup = this.squad.lineup.map((slot, index) => ({
      ...slot,
      role: template[index].role,
      top: template[index].top,
      left: template[index].left,
    }));

    this.squad.recommendation = {
      title: 'Схема обновлена',
      message: `Команда перестроена на схему ${formation}.`,
      level: 'warning',
    };

    return this.squad;
  }

  swapLineupPlayers(firstSlotId: number, secondSlotId: number) {
    const firstSlot = this.squad.lineup.find((slot) => slot.id === firstSlotId);
    const secondSlot = this.squad.lineup.find((slot) => slot.id === secondSlotId);

    if (!firstSlot || !secondSlot) {
      throw new NotFoundException('One or both lineup slots not found');
    }

    this.squad.lineup = this.squad.lineup.map((slot) => {
      if (slot.id === firstSlotId) {
        return {
          ...slot,
          playerId: secondSlot.playerId,
          name: secondSlot.name,
        };
      }

      if (slot.id === secondSlotId) {
        return {
          ...slot,
          playerId: firstSlot.playerId,
          name: firstSlot.name,
        };
      }

      return slot;
    });

    this.squad.recommendation = {
      title: 'Игроки переставлены',
      message: `${firstSlot.name} и ${secondSlot.name} поменялись местами.`,
      level: 'warning',
    };

    return this.squad;
  }

  replacePlayer(
    lineupSlotId: number,
    sourceType: 'bench' | 'reserves',
    sourceItemId: number,
  ) {
    const lineupSlot = this.squad.lineup.find((slot) => slot.id === lineupSlotId);

    if (!lineupSlot) {
      throw new NotFoundException('Lineup slot not found');
    }

    const sourceList = sourceType === 'bench' ? this.squad.bench : this.squad.reserves;
    const sourceItem = sourceList.find((item) => item.id === sourceItemId);

    if (!sourceItem) {
      throw new NotFoundException(`${sourceType} player not found`);
    }

    const oldStarter = {
      id: Date.now(),
      playerId: lineupSlot.playerId,
      name: lineupSlot.name,
      position: lineupSlot.role,
    };

    this.squad.lineup = this.squad.lineup.map((slot) => {
      if (slot.id !== lineupSlotId) return slot;

      return {
        ...slot,
        playerId: sourceItem.playerId,
        name: sourceItem.name,
      };
    });

    if (sourceType === 'bench') {
      this.squad.bench = this.squad.bench
        .filter((item) => item.id !== sourceItemId)
        .concat(oldStarter);
    } else {
      this.squad.reserves = this.squad.reserves
        .filter((item) => item.id !== sourceItemId)
        .concat(oldStarter);
    }

    this.squad.recommendation = {
      title: 'Замена выполнена',
      message: `${sourceItem.name} вышел в основу вместо ${lineupSlot.name}.`,
      level: 'good',
    };

    return this.squad;
  }
}
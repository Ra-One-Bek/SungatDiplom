import { Injectable, NotFoundException } from '@nestjs/common';
import { squadsMock } from '../data/squads.mock';

type ClubId = 'astana' | 'kairat' | 'kaisar';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

@Injectable()
export class SquadService {
  private squadByClub: Record<ClubId, any> = {
    astana: deepClone(squadsMock.astana),
    kairat: deepClone(squadsMock.kairat),
    kaisar: deepClone(squadsMock.kaisar),
  };

  getSquad(clubId: ClubId = 'astana') {
    return this.squadByClub[clubId];
  }

  updateFormation(formation: string, clubId: ClubId = 'astana') {
    this.squadByClub[clubId].formation = formation;
    return this.squadByClub[clubId];
  }

  swapLineupPlayers(
    firstSlotId: number,
    secondSlotId: number,
    clubId: ClubId = 'astana',
  ) {
    const squad = this.squadByClub[clubId];

    const first = squad.lineup.find((slot: any) => slot.id === firstSlotId);
    const second = squad.lineup.find((slot: any) => slot.id === secondSlotId);

    if (!first || !second) {
      throw new NotFoundException('Lineup slot not found');
    }

    const firstPlayerId = first.playerId;
    const firstName = first.name;

    first.playerId = second.playerId;
    first.name = second.name;

    second.playerId = firstPlayerId;
    second.name = firstName;

    return squad;
  }

  replacePlayer(
    lineupSlotId: number,
    sourceType: 'bench' | 'reserves',
    sourceItemId: number,
    clubId: ClubId = 'astana',
  ) {
    const squad = this.squadByClub[clubId];

    const lineupSlot = squad.lineup.find((slot: any) => slot.id === lineupSlotId);
    if (!lineupSlot) {
      throw new NotFoundException('Lineup slot not found');
    }

    const sourceList = sourceType === 'bench' ? squad.bench : squad.reserves;
    const sourceItemIndex = sourceList.findIndex((item: any) => item.id === sourceItemId);

    if (sourceItemIndex === -1) {
      throw new NotFoundException(`${sourceType} item not found`);
    }

    const sourceItem = sourceList[sourceItemIndex];

    const outgoingPlayer = {
      id: Date.now(),
      playerId: lineupSlot.playerId,
      name: lineupSlot.name,
      position: lineupSlot.role,
    };

    lineupSlot.playerId = sourceItem.playerId;
    lineupSlot.name = sourceItem.name;

    sourceList.splice(sourceItemIndex, 1);
    sourceList.push(outgoingPlayer);

    return squad;
  }
}
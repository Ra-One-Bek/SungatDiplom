import type { Player, PlayerPosition } from '../types/player';
import type { SquadPlayerSlot } from '../types/squad';

type FormationTemplate = {
  role: PlayerPosition;
  top: string;
  left: string;
};

export const formationTemplates: Record<string, FormationTemplate[]> = {
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

export function applyFormationToLineup(
  lineup: SquadPlayerSlot[],
  formation: string
): SquadPlayerSlot[] {
  const template = formationTemplates[formation];

  if (!template || template.length !== lineup.length) return lineup;

  return lineup.map((slot, index) => ({
    ...slot,
    role: template[index].role,
    top: template[index].top,
    left: template[index].left,
  }));
}

export function getPositionCompatibility(
  player: Player,
  targetRole: PlayerPosition
): number {
  if (player.position === targetRole) return 100;
  if (player.secondaryPositions.includes(targetRole)) return 78;

  if (player.position === 'GK' && targetRole !== 'GK') return 5;
  if (player.position !== 'GK' && targetRole === 'GK') return 5;

  const defenseRoles: PlayerPosition[] = ['CB', 'LB', 'RB'];
  const midfieldRoles: PlayerPosition[] = ['CDM', 'CM', 'CAM', 'LM', 'RM'];
  const attackRoles: PlayerPosition[] = ['LW', 'RW', 'ST'];

  const sameDefenseGroup =
    defenseRoles.includes(player.position) && defenseRoles.includes(targetRole);
  const sameMidfieldGroup =
    midfieldRoles.includes(player.position) && midfieldRoles.includes(targetRole);
  const sameAttackGroup =
    attackRoles.includes(player.position) && attackRoles.includes(targetRole);

  if (sameDefenseGroup || sameMidfieldGroup || sameAttackGroup) return 60;

  if (
    (midfieldRoles.includes(player.position) && attackRoles.includes(targetRole)) ||
    (attackRoles.includes(player.position) && midfieldRoles.includes(targetRole))
  ) {
    return 45;
  }

  if (
    (midfieldRoles.includes(player.position) && defenseRoles.includes(targetRole)) ||
    (defenseRoles.includes(player.position) && midfieldRoles.includes(targetRole))
  ) {
    return 40;
  }

  if (
    (defenseRoles.includes(player.position) && attackRoles.includes(targetRole)) ||
    (attackRoles.includes(player.position) && defenseRoles.includes(targetRole))
  ) {
    return 20;
  }

  return 25;
}

export function getCompatibilityLevel(score: number): 'good' | 'warning' | 'bad' {
  if (score >= 75) return 'good';
  if (score >= 45) return 'warning';
  return 'bad';
}

export function getCompatibilityMessage(
  player: Player,
  targetRole: PlayerPosition,
  score: number
): string {
  if (score >= 90) {
    return `${player.name} идеально подходит для позиции ${targetRole}.`;
  }

  if (score >= 75) {
    return `${player.name} хорошо подходит для позиции ${targetRole}.`;
  }

  if (score >= 45) {
    return `${player.name} частично подходит для позиции ${targetRole}. Это рабочий вариант, но не оптимальный.`;
  }

  if (player.position === 'GK' && targetRole !== 'GK') {
    return `${player.name} является вратарем. Не рекомендуется ставить его на позицию ${targetRole}.`;
  }

  if (player.position !== 'GK' && targetRole === 'GK') {
    return `${player.name} не является вратарем. Не рекомендуется ставить его в ворота.`;
  }

  return `${player.name} плохо подходит для позиции ${targetRole}. Лучше выбрать другого футболиста.`;
}
import type { Player } from '../types/player';

export function calculateChemistry(p1: Player, p2: Player): number {
  let score = 0;

  // 🇺🇳 одна страна
  if (p1.nationality === p2.nationality) score += 2;

  // ⚽ похожая позиция
  if (p1.position === p2.position) score += 1;

  // 📉 форма
  if ((p1.form ?? 0) < 6.5 || (p2.form ?? 0) < 6.5) score -= 1;

  return score;
}

export function chemistryColor(score: number) {
  if (score >= 2) return 'green';
  if (score === 1) return 'yellow';
  return 'red';
}
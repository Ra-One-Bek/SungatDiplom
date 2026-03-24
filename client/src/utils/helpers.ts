export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}

export function getFormLabel(form: number): string {
  if (form >= 85) return 'Отличная';
  if (form >= 70) return 'Хорошая';
  if (form >= 55) return 'Средняя';
  return 'Слабая';
}

export function getInjuryLabel(status: string): string {
  switch (status) {
    case 'fit':
      return 'Готов';
    case 'doubtful':
      return 'Под вопросом';
    case 'injured':
      return 'Травмирован';
    case 'suspended':
      return 'Дисквалифицирован';
    default:
      return 'Неизвестно';
  }
}
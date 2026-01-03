/**
 * Утилиты для работы с форматом времени
 */

export type TimeUnit = 'minutes' | 'seconds';

/**
 * Форматирует время из секунд в строку "X мин. Y сек."
 * @param seconds - время в секундах
 * @returns отформатированная строка
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) {
    return '0 сек.';
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} сек.`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} мин.`;
  }

  return `${minutes} мин. ${remainingSeconds} сек.`;
}

/**
 * Конвертирует минуты в секунды
 */
export function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}

/**
 * Конвертирует секунды в минуты
 */
export function secondsToMinutes(seconds: number): number {
  return seconds / 60;
}


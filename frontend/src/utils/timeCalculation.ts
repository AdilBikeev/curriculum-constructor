/**
 * Добавить секунды к времени (24-часовой формат)
 * @param time - время в формате HH:MM или HH:MM:SS
 * @param seconds - количество секунд для добавления
 * @returns время в формате HH:MM:SS
 */
export const addMinutesToTime = (time: string, seconds: number): string => {
  const parts = time.split(':');
  const hours = Number(parts[0]);
  const mins = Number(parts[1]);
  const secs = parts[2] ? Number(parts[2]) : 0;
  
  const totalSeconds = (hours * 60 + mins) * 60 + secs + seconds;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const newHours = Math.floor(totalMinutes / 60) % 24; // Ограничиваем до 24-часового формата
  const newMins = totalMinutes % 60;
  const newSecs = totalSeconds % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`;
};

/**
 * Форматировать время для отображения (HH:MM:SS)
 * Если время в формате HH:MM, добавляет :00 для секунд
 */
export const formatTime = (time: string): string => {
  const parts = time.split(':');
  if (parts.length === 2) {
    // Если формат HH:MM, добавляем секунды
    return `${time}:00`;
  }
  // Если уже в формате HH:MM:SS, возвращаем как есть
  return time;
};

/**
 * Валидировать время в формате HH:MM
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};


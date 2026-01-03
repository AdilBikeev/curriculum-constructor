/**
 * Добавить минуты к времени (24-часовой формат)
 */
export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24; // Ограничиваем до 24-часового формата
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

/**
 * Форматировать время для отображения (HH:MM)
 */
export const formatTime = (time: string): string => {
  const [hours, mins] = time.split(':').map(Number);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Валидировать время в формате HH:MM
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};


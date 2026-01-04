import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { LessonPlanItem } from '../../types';
import { Button } from '../common/Button';
import { addMinutesToTime } from '../../utils/timeCalculation';

interface ImportExportPanelProps {
  items: LessonPlanItem[];
  stageOrder: string[];
  lessonStartTime: string;
}

const PanelCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
  margin-top: ${({ theme }) => theme.spacing.sm};
  white-space: pre-wrap;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const InfoText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
`;

/**
 * Форматирует длительность в секундах в строку с минутами и секундами
 * @param seconds - длительность в секундах
 * @returns отформатированная строка (например: "5 мин.", "30 сек.", "5 мин. 30 сек.")
 */
function formatDuration(seconds: number): string {
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
 * Форматирует план занятия в текстовый формат
 */
function formatPlanToText(
  items: LessonPlanItem[],
  stageOrder: string[],
  lessonStartTime: string
): string {
  if (items.length === 0) {
    return '';
  }

  // Группируем элементы по стадиям
  const groupedByStage: { [stageId: string]: LessonPlanItem[] } = {};
  items.forEach((item) => {
    if (!groupedByStage[item.stageId]) {
      groupedByStage[item.stageId] = [];
    }
    groupedByStage[item.stageId].push(item);
  });

  // Сортируем элементы внутри каждой стадии по order
  Object.keys(groupedByStage).forEach((stageId) => {
    groupedByStage[stageId].sort((a, b) => a.order - b.order);
  });

  // Создаем правильный порядок элементов: стадии в порядке stageOrder, внутри каждой - элементы по order
  const orderedItems: LessonPlanItem[] = [];
  stageOrder.forEach((stageId) => {
    const stageItems = groupedByStage[stageId] || [];
    orderedItems.push(...stageItems);
  });

  // Вычисляем время начала для каждого элемента в правильном порядке их следования
  const itemStartTimes: { [itemId: string]: string } = {};
  // Убеждаемся, что lessonStartTime в формате HH:MM:SS
  let currentTime = lessonStartTime.length === 5 ? `${lessonStartTime}:00` : lessonStartTime;
  orderedItems.forEach((item) => {
    itemStartTimes[item.id] = currentTime;
    currentTime = addMinutesToTime(currentTime, item.duration);
  });

  // Вычисляем время начала для каждой стадии (время начала первого упражнения стадии)
  const stageStartTimes: { [stageId: string]: string } = {};
  stageOrder.forEach((stageId) => {
    const       stageItems = groupedByStage[stageId] || [];
    if (stageItems.length > 0) {
      // Берем первый элемент стадии (уже отсортированный по order)
      const defaultTime = lessonStartTime.length === 5 ? `${lessonStartTime}:00` : lessonStartTime;
      stageStartTimes[stageId] = itemStartTimes[stageItems[0].id] || defaultTime;
    } else {
      stageStartTimes[stageId] = lessonStartTime.length === 5 ? `${lessonStartTime}:00` : lessonStartTime;
    }
  });

  // Формируем текст
  const lines: string[] = [];
  let stageNumber = 1;

  stageOrder.forEach((stageId) => {
    const stageItems = groupedByStage[stageId] || [];
    if (stageItems.length === 0) return;

    // Сортируем элементы внутри стадии по order
    const sortedStageItems = [...stageItems].sort((a, b) => a.order - b.order);

    // Получаем название стадии из первого элемента
    const stageName = sortedStageItems[0].stageName;
    const stageStartTime = stageStartTimes[stageId] || lessonStartTime;

    // Вычисляем общую длительность стадии
    const stageDurationSeconds = sortedStageItems.reduce((sum, item) => sum + item.duration, 0);
    const stageDurationText = formatDuration(stageDurationSeconds);

    // Добавляем строку стадии
    lines.push(`${stageNumber}) ${stageName} (${stageDurationText}) начало в ${stageStartTime}`);

    // Добавляем упражнения стадии
    sortedStageItems.forEach((item, exerciseIndex) => {
      const exerciseDurationText = formatDuration(item.duration);
      const exerciseStartTime = itemStartTimes[item.id] || stageStartTime;
      lines.push(`\t${stageNumber}.${exerciseIndex + 1}) ${item.exerciseName} (${exerciseDurationText}) начало в ${exerciseStartTime}`);
    });

    stageNumber++;
  });

  return lines.join('\n');
}

/**
 * Скачивает текст как файл
 */
function downloadTextAsFile(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  items,
  stageOrder,
  lessonStartTime,
}) => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formattedText = useMemo(() => {
    return formatPlanToText(items, stageOrder, lessonStartTime);
  }, [items, stageOrder, lessonStartTime]);

  const hasPlan = items.length > 0;

  const handleCopyToClipboard = () => {
    if (!hasPlan) {
      setMessage({ type: 'error', text: 'Нет плана для выгрузки' });
      return;
    }

    try {
      navigator.clipboard.writeText(formattedText).then(() => {
        setMessage({ type: 'success', text: 'План скопирован в буфер обмена!' });
        setTimeout(() => setMessage(null), 3000);
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при копировании в буфер обмена' });
    }
  };

  const handleDownloadFile = () => {
    if (!hasPlan) {
      setMessage({ type: 'error', text: 'Нет плана для выгрузки' });
      return;
    }

    try {
      const filename = `plan-${new Date().toISOString().split('T')[0]}.txt`;
      downloadTextAsFile(formattedText, filename);
      setMessage({ type: 'success', text: 'План выгружен в файл!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при выгрузке файла' });
    }
  };

  return (
    <PanelCard>
      <ButtonGroup>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyToClipboard}
            disabled={!hasPlan}
            style={{ flex: 1, minWidth: '120px' }}
          >
            📋 Копировать
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadFile}
            disabled={!hasPlan}
            style={{ flex: 1, minWidth: '120px' }}
          >
            💾 Скачать файл
          </Button>
        </div>
      </ButtonGroup>

      <InfoText>
        План занятия в текстовом формате:
      </InfoText>
      <TextArea
        value={formattedText}
        readOnly
        placeholder={hasPlan ? '' : 'Создайте план занятия, чтобы увидеть его текстовое представление'}
      />

      {message && (
        message.type === 'success' ? (
          <SuccessMessage>{message.text}</SuccessMessage>
        ) : (
          <ErrorMessage>{message.text}</ErrorMessage>
        )
      )}

      {!hasPlan && (
        <InfoText style={{ marginTop: '1rem' }}>
          💡 Добавьте стадии и упражнения в план, чтобы увидеть его текстовое представление
        </InfoText>
      )}
    </PanelCard>
  );
};

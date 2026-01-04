import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { LessonPlan } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  exportLessonPlanToString,
  exportLessonPlanToFile,
  importLessonPlanFromString,
  importLessonPlanFromFile,
} from '../../utils/storage';

interface ImportExportPanelProps {
  currentPlan: LessonPlan | null;
  onPlanImported: (plan: LessonPlan) => void;
}

const PanelCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PanelTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const InfoText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
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

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  currentPlan,
  onPlanImported,
}) => {
  const [importString, setImportString] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportToString = () => {
    if (!currentPlan) {
      setMessage({ type: 'error', text: 'Нет плана для экспорта' });
      return;
    }

    try {
      const jsonString = exportLessonPlanToString(currentPlan);
      setImportString(jsonString);
      navigator.clipboard.writeText(jsonString).then(() => {
        setMessage({ type: 'success', text: 'План скопирован в буфер обмена!' });
        setTimeout(() => setMessage(null), 3000);
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при экспорте плана' });
    }
  };

  const handleExportToFile = () => {
    if (!currentPlan) {
      setMessage({ type: 'error', text: 'Нет плана для экспорта' });
      return;
    }

    try {
      exportLessonPlanToFile(currentPlan, `plan-${currentPlan.title.replace(/[^a-zа-я0-9]/gi, '-')}.json`);
      setMessage({ type: 'success', text: 'План экспортирован в файл!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при экспорте в файл' });
    }
  };

  const handleImportFromString = () => {
    if (!importString.trim()) {
      setMessage({ type: 'error', text: 'Введите JSON строку для импорта' });
      return;
    }

    try {
      const plan = importLessonPlanFromString(importString);
      if (plan) {
        onPlanImported(plan);
        setMessage({ type: 'success', text: 'План успешно импортирован!' });
        setImportString('');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Неверный формат JSON' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при импорте плана' });
    }
  };

  const handleImportFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const plan = await importLessonPlanFromFile(file);
      if (plan) {
        onPlanImported(plan);
        setMessage({ type: 'success', text: 'План успешно импортирован из файла!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Неверный формат файла' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при чтении файла' });
    }

    // Очищаем input для возможности повторного выбора того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportString(text);
      setMessage({ type: 'success', text: 'Текст вставлен из буфера обмена' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Не удалось прочитать буфер обмена' });
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PanelCard>
      <ButtonGroup>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportToString}
            disabled={!currentPlan}
            style={{ flex: 1, minWidth: '120px' }}
          >
            📋 Копировать
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportToFile}
            disabled={!currentPlan}
            style={{ flex: 1, minWidth: '120px' }}
          >
            💾 Скачать файл
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFromFile}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFileButtonClick}
            style={{ flex: 1, minWidth: '120px' }}
          >
            📁 Загрузить файл
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePasteFromClipboard}
            style={{ flex: 1, minWidth: '120px' }}
          >
            📥 Вставить
          </Button>
        </div>
      </ButtonGroup>

      <InfoText>
        Вставьте JSON строку плана урока для импорта:
      </InfoText>
      <TextArea
        value={importString}
        onChange={(e) => setImportString(e.target.value)}
        placeholder='{"id": "...", "title": "...", "items": [...]}'
      />
      <Button
        variant="success"
        size="sm"
        onClick={handleImportFromString}
        disabled={!importString.trim()}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        ✅ Импортировать план
      </Button>

      {message && (
        message.type === 'success' ? (
          <SuccessMessage>{message.text}</SuccessMessage>
        ) : (
          <ErrorMessage>{message.text}</ErrorMessage>
        )
      )}

      <InfoText style={{ marginTop: '1rem' }}>
        💡 Экспортируйте план в файл или скопируйте JSON строку для передачи на другой компьютер
      </InfoText>
    </PanelCard>
  );
};


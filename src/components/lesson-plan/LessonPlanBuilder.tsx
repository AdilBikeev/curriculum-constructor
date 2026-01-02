import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { LessonPlanItem, LessonStage, Exercise } from '../../types';
import { AddExerciseForm } from './AddExerciseForm';
import { LessonPlanItemComponent } from './LessonPlanItem';
import { TimeIndicator } from './TimeIndicator';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import {
  calculateTotalDuration,
  createLessonPlanItem,
  canAddExercise,
  moveItemUp,
  moveItemDown,
  reorderItems,
} from '../../utils/lessonPlan';

interface LessonPlanBuilderProps {
  stages: LessonStage[];
  onSave?: (items: LessonPlanItem[]) => void;
}

const BuilderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 380px;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    position: static;
    max-height: none;
  }
`;

const PlanList = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
  gap: 0;
`;

const EmptyState = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md} !important;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.lightGray};
  border: 2px dashed ${({ theme }) => theme.colors.gray};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
`;

const EmptyTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ActionsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} !important;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg} !important;
  }
`;

const CompactCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.md} !important;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg} !important;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const CompactSectionTitle = styled(SectionTitle)`
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WarningMessage = styled.div<{ $isError: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $isError }) =>
    $isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${({ theme, $isError }) => ($isError ? theme.colors.danger : theme.colors.warning)};
  font-size: 0.875rem;
  border-left: 4px solid
    ${({ theme, $isError }) => ($isError ? theme.colors.danger : theme.colors.warning)};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const LessonPlanBuilder: React.FC<LessonPlanBuilderProps> = ({ stages, onSave }) => {
  const [items, setItems] = useState<LessonPlanItem[]>([]);

  // Всегда храним элементы отсортированными по order
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.order - b.order);
  }, [items]);

  const totalDuration = useMemo(() => calculateTotalDuration(items), [items]);
  const isOverTime = totalDuration > 90;
  const isNearLimit = totalDuration > 80 && totalDuration <= 90;

  const handleAddExercise = (stageId: string, exerciseId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    const exercise = stage?.exercises.find((e) => e.id === exerciseId);

    if (!stage || !exercise) return;

    if (!canAddExercise(totalDuration, exercise.duration)) {
      alert('Недостаточно времени для добавления этого упражнения!');
      return;
    }

    const newItem = createLessonPlanItem(stage, exercise, items.length + 1);
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => reorderItems(prev.filter((item) => item.id !== id)));
  };

  const handleMoveUp = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveItemUp(prev, id);
      return result;
    });
  }, []);

  const handleMoveDown = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveItemDown(prev, id);
      return result;
    });
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(items);
    } else {
      console.log('План урока:', items);
      alert('План урока сохранен! (в консоли)');
    }
  };

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите очистить план урока?')) {
      setItems([]);
    }
  };

  const getExerciseById = (stageId: string, exerciseId: string): Exercise | undefined => {
    const stage = stages.find((s) => s.id === stageId);
    return stage?.exercises.find((e) => e.id === exerciseId);
  };

  return (
    <BuilderContainer>
      <MainContent>
        <AddExerciseForm stages={stages} onAdd={handleAddExercise} disabled={isOverTime} />

        <CompactCard>
          <SectionTitle>📋 План урока</SectionTitle>
          {items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>План урока пуст</EmptyTitle>
              <EmptyDescription>
                Выберите стадию и упражнение из формы выше, чтобы начать формировать план
              </EmptyDescription>
            </EmptyState>
          ) : (
            <PlanList>
              {sortedItems.map((item, index) => (
                <LessonPlanItemComponent
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  canMoveUp={index > 0}
                  canMoveDown={index < sortedItems.length - 1}
                />
              ))}
            </PlanList>
          )}
        </CompactCard>
      </MainContent>

      <Sidebar>
        <CompactCard>
          <CompactSectionTitle>
            ⏱️ Время занятия
          </CompactSectionTitle>
          <TimeIndicator usedTime={totalDuration} />
          {isOverTime && (
            <WarningMessage $isError={true}>
              ⚠️ Превышено время занятия! Удалите некоторые упражнения.
            </WarningMessage>
          )}
          {isNearLimit && !isOverTime && (
            <WarningMessage $isError={false}>
              ⚡ Осталось мало времени. Будьте внимательны при добавлении новых упражнений.
            </WarningMessage>
          )}
        </CompactCard>

        <ActionsCard>
          <Button onClick={handleSave} disabled={items.length === 0 || isOverTime} size="sm">
            Сохранить план
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={items.length === 0} size="sm">
            Очистить план
          </Button>
        </ActionsCard>
      </Sidebar>
    </BuilderContainer>
  );
};


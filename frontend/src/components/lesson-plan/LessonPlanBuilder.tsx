import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { LessonPlanItem, LessonStage, Exercise, LessonPlan } from '../../types';
import { StageSelectionModal } from './StageSelectionModal';
import { AddExerciseToStageModal } from './AddExerciseToStageModal';
import { AddStageButton } from './AddStageButton';
import { LessonPlanItemComponent } from './LessonPlanItem';
import { StageGroup } from './StageGroup';
import { TimeIndicator } from './TimeIndicator';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TimeInput } from '../common/TimeInput';
import {
  calculateTotalDuration,
  createLessonPlanItem,
  canAddExercise,
  moveExerciseInStageUp,
  moveExerciseInStageDown,
  moveStageUp,
  moveStageDown,
  reorderItems,
} from '../../utils/lessonPlan';
import { addMinutesToTime } from '../../utils/timeCalculation';
import {
  createLessonPlanFromItems,
} from '../../utils/storage';
import { ImportExportPanel } from './ImportExportPanel';

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

const AutoSaveIndicator = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  margin-top: ${({ theme }) => theme.spacing.xs};
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

const PlanTitleInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
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
  const [planTitle, setPlanTitle] = useState<string>('');
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [planStageOrder, setPlanStageOrder] = useState<string[]>([]);
  const [lessonStartTime, setLessonStartTime] = useState<string>('14:00');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAddExerciseToStageModalOpen, setIsAddExerciseToStageModalOpen] = useState(false);
  const [stageModalPosition, setStageModalPosition] = useState<'top' | 'bottom'>('bottom');
  const [addExerciseToStageModalStageId, setAddExerciseToStageModalStageId] = useState<string | null>(null);

  // Используем элементы в том порядке, в котором они были установлены пользователем
  const sortedItems = useMemo(() => {
    return [...items];
  }, [items]);

  // Группируем элементы по стадиям
  const groupedByStage = useMemo(() => {
    const groups: { [stageId: string]: LessonPlanItem[] } = {};
    sortedItems.forEach((item) => {
      if (!groups[item.stageId]) {
        groups[item.stageId] = [];
      }
      groups[item.stageId].push(item);
    });
    // Создаем новые массивы для каждой группы, чтобы React видел изменения
    const newGroups: { [stageId: string]: LessonPlanItem[] } = {};
    Object.keys(groups).forEach((stageId) => {
      newGroups[stageId] = [...groups[stageId]];
    });
    return newGroups;
  }, [sortedItems]);

  // Получаем порядок стадий (объединяем стадии из плана и из items)
  const stageOrder = useMemo(() => {
    const order: string[] = [];
    const seen = new Set<string>();
    
    // Сначала добавляем стадии из planStageOrder
    planStageOrder.forEach((stageId) => {
      if (!seen.has(stageId)) {
        order.push(stageId);
        seen.add(stageId);
      }
    });
    
    // Затем добавляем стадии из items, которых еще нет в порядке
    sortedItems.forEach((item) => {
      if (!seen.has(item.stageId)) {
        order.push(item.stageId);
        seen.add(item.stageId);
      }
    });
    
    return order;
  }, [sortedItems, planStageOrder]);

  const totalDuration = useMemo(() => calculateTotalDuration(items), [items]);
  const isOverTime = totalDuration > 90;
  const isNearLimit = totalDuration > 80 && totalDuration <= 90;

  // Вычисляем время начала для каждого элемента
  const itemStartTimes = useMemo(() => {
    const times: { [itemId: string]: string } = {};
    let currentTime = lessonStartTime;
    
    sortedItems.forEach((item) => {
      times[item.id] = currentTime;
      currentTime = addMinutesToTime(currentTime, item.duration);
    });
    
    return times;
  }, [sortedItems, lessonStartTime]);

  // Вычисляем время начала для каждой стадии (время начала первого упражнения стадии)
  const stageStartTimes = useMemo(() => {
    const times: { [stageId: string]: string } = {};
    
    stageOrder.forEach((stageId) => {
      const stageItems = groupedByStage[stageId] || [];
      if (stageItems.length > 0) {
        // Время начала стадии = время начала первого упражнения в стадии
        times[stageId] = itemStartTimes[stageItems[0].id] || lessonStartTime;
      } else {
        // Если стадия пустая, вычисляем время начала на основе предыдущих стадий
        let currentTime = lessonStartTime;
        let found = false;
        for (const prevStageId of stageOrder) {
          if (prevStageId === stageId) {
            times[stageId] = currentTime;
            found = true;
            break;
          }
          const prevStageItems = groupedByStage[prevStageId] || [];
          prevStageItems.forEach((item) => {
            currentTime = addMinutesToTime(currentTime, item.duration);
          });
        }
        if (!found) {
          times[stageId] = currentTime;
        }
      }
    });
    
    return times;
  }, [stageOrder, groupedByStage, itemStartTimes, lessonStartTime]);

  const handleAddStageClick = (position: 'top' | 'bottom') => {
    setStageModalPosition(position);
    setIsStageModalOpen(true);
  };

  const handleStageSelected = (stageId: string) => {
    // Добавляем стадию в план (пустую)
    setPlanStageOrder((prev) => {
      const newOrder = [...prev];
      if (stageModalPosition === 'top') {
        newOrder.unshift(stageId);
      } else {
        newOrder.push(stageId);
      }
      return newOrder;
    });
    
    // Разворачиваем стадию при добавлении
    setExpandedStages((prev) => new Set(prev).add(stageId));
    
    setIsStageModalOpen(false);
  };


  const handleAddExerciseToExistingStage = (stageId: string) => {
    setAddExerciseToStageModalStageId(stageId);
    setIsAddExerciseToStageModalOpen(true);
  };

  const handleAddExerciseToStageFromModal = (exerciseId: string) => {
    if (!addExerciseToStageModalStageId) return;
    
    const stage = stages.find((s) => s.id === addExerciseToStageModalStageId);
    const exercise = stage?.exercises.find((e) => e.id === exerciseId);

    if (!stage || !exercise) return;

    if (!canAddExercise(totalDuration, exercise.duration)) {
      alert('Недостаточно времени для добавления этого упражнения!');
      return;
    }

    // Разворачиваем стадию при добавлении нового элемента
    setExpandedStages((prev) => new Set(prev).add(addExerciseToStageModalStageId));

    setItems((prev) => {
      // Находим последний элемент этой стадии в массиве
      let insertIndex = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].stageId === addExerciseToStageModalStageId) {
          insertIndex = i + 1;
          break;
        }
      }
      
      const newItem = createLessonPlanItem(stage, exercise, insertIndex + 1);
      const newItems = [
        ...prev.slice(0, insertIndex),
        newItem,
        ...prev.slice(insertIndex),
      ];
      
      // Пересчитываем order для всех элементов
      return reorderItems(newItems);
    });

    setAddExerciseToStageModalStageId(null);
    setIsAddExerciseToStageModalOpen(false);
  };

  const handleRemoveStage = (stageId: string) => {
    // Удаляем все элементы этой стадии
    setItems((prev) => reorderItems(prev.filter((item) => item.stageId !== stageId)));
    // Удаляем стадию из порядка
    setPlanStageOrder((prev) => prev.filter((id) => id !== stageId));
  };

  const handleAddExercise = (stageId: string, exerciseId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    const exercise = stage?.exercises.find((e) => e.id === exerciseId);

    if (!stage || !exercise) return;

    if (!canAddExercise(totalDuration, exercise.duration)) {
      alert('Недостаточно времени для добавления этого упражнения!');
      return;
    }

    // Разворачиваем стадию при добавлении нового элемента
    setExpandedStages((prev) => new Set(prev).add(stageId));

    setItems((prev) => {
      // Находим последний элемент этой стадии в массиве
      let insertIndex = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].stageId === stageId) {
          insertIndex = i + 1;
          break;
        }
      }
      
      const newItem = createLessonPlanItem(stage, exercise, insertIndex + 1);
      const newItems = [
        ...prev.slice(0, insertIndex),
        newItem,
        ...prev.slice(insertIndex),
      ];
      
      // Пересчитываем order для всех элементов
      return reorderItems(newItems);
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      const newItems = reorderItems(prev.filter((item) => item.id !== id));
      
      // Если это был последний элемент стадии, стадию не удаляем из порядка
      // (стадия остается пустой, что допустимо)
      
      return newItems;
    });
  };

  const handleMoveExerciseUp = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveExerciseInStageUp(prev, id);
      // Убеждаемся, что возвращаем новый массив (для React)
      return result;
    });
  }, []);

  const handleMoveExerciseDown = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveExerciseInStageDown(prev, id);
      // Убеждаемся, что возвращаем новый массив (для React)
      return result;
    });
  }, []);

  const handleMoveStageUp = React.useCallback((stageId: string) => {
    setItems((prev) => {
      const result = moveStageUp(prev, stageId);
      return result;
    });
  }, []);

  const handleMoveStageDown = React.useCallback((stageId: string) => {
    setItems((prev) => {
      const result = moveStageDown(prev, stageId);
      return result;
    });
  }, []);

  const handleSave = () => {
    if (items.length === 0) {
      alert('Нечего сохранять! Добавьте упражнения в план урока.');
      return;
    }

    if (isOverTime) {
      alert('Нельзя сохранить план урока с превышенным временем!');
      return;
    }

    const plan = createLessonPlanFromItems(items, planTitle || undefined);
    
    // Сохраняем ID плана, если он уже существует
    if (currentPlanId) {
      plan.id = currentPlanId;
    } else {
      setCurrentPlanId(plan.id);
    }

    if (onSave) {
      onSave(items);
    } else {
      alert(`✅ План урока "${plan.title}" готов к экспорту! Используйте панель импорта/экспорта для сохранения.`);
    }
  };

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите очистить план урока? Все несохраненные изменения будут потеряны.')) {
      setItems([]);
      setPlanTitle('');
      setCurrentPlanId(null);
      setPlanStageOrder([]);
      setExpandedStages(new Set());
    }
  };

  const handlePlanImported = (plan: LessonPlan) => {
    // Пересчитываем order согласно порядку элементов в массиве
    const reorderedItems = reorderItems(plan.items);
    setItems(reorderedItems);
    setPlanTitle(plan.title);
    setCurrentPlanId(plan.id);
  };

  const getCurrentPlan = (): LessonPlan | null => {
    if (items.length === 0 && stageOrder.length === 0) return null;
    const plan = createLessonPlanFromItems(items, planTitle || undefined);
    if (currentPlanId) {
      plan.id = currentPlanId;
    }
    return plan;
  };

  const getExerciseById = (stageId: string, exerciseId: string): Exercise | undefined => {
    const stage = stages.find((s) => s.id === stageId);
    return stage?.exercises.find((e) => e.id === exerciseId);
  };

  const handleToggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const getStageCanMoveUp = (stageId: string): boolean => {
    const stageIndex = stageOrder.indexOf(stageId);
    return stageIndex > 0;
  };

  const getStageCanMoveDown = (stageId: string): boolean => {
    const stageIndex = stageOrder.indexOf(stageId);
    return stageIndex >= 0 && stageIndex < stageOrder.length - 1;
  };

  return (
    <BuilderContainer>
      <MainContent>
        <CompactCard>
          <SectionTitle>📋 План урока</SectionTitle>
          {items.length > 0 && (
            <PlanTitleInput
              type="text"
              placeholder="Название плана урока..."
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
            />
          )}
          {stageOrder.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>План урока пуст</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку "Добавить стадию" ниже, чтобы начать формировать план
              </EmptyDescription>
              <AddStageButton onClick={() => handleAddStageClick('bottom')} disabled={isOverTime} />
            </EmptyState>
          ) : (
            <PlanList>
              <AddStageButton onClick={() => handleAddStageClick('top')} disabled={isOverTime} />
              {stageOrder.map((stageId) => {
                const stageItems = groupedByStage[stageId] || [];
                const stage = stages.find((s) => s.id === stageId);
                const stageName = stage?.name || (stageItems.length > 0 ? stageItems[0].stageName : 'Неизвестная стадия');

                return (
                  <StageGroup
                    key={stageId}
                    stageId={stageId}
                    stageName={stageName}
                    items={stageItems}
                    stageStartTime={stageStartTimes[stageId] || lessonStartTime}
                    itemStartTimes={itemStartTimes}
                    onRemoveItem={handleRemoveItem}
                    onMoveExerciseUp={handleMoveExerciseUp}
                    onMoveExerciseDown={handleMoveExerciseDown}
                    onMoveStageUp={handleMoveStageUp}
                    onMoveStageDown={handleMoveStageDown}
                    canMoveStageUp={getStageCanMoveUp(stageId)}
                    canMoveStageDown={getStageCanMoveDown(stageId)}
                    isExpanded={expandedStages.has(stageId)}
                    onToggleExpand={handleToggleStage}
                    onAddExercise={handleAddExerciseToExistingStage}
                  />
                );
              })}
              <AddStageButton onClick={() => handleAddStageClick('bottom')} disabled={isOverTime} />
            </PlanList>
          )}
        </CompactCard>
      </MainContent>

      <Sidebar>
        <CompactCard>
          <CompactSectionTitle>
            ⏱️ Время занятия
          </CompactSectionTitle>
          <div style={{ marginBottom: '1rem' }}>
            <TimeInput
              label="Время начала занятия"
              value={lessonStartTime}
              onChange={(value) => setLessonStartTime(value)}
            />
          </div>
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
          <Button onClick={handleSave} disabled={stageOrder.length === 0 || isOverTime} size="sm">
            💾 Сохранить план
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={stageOrder.length === 0} size="sm">
            🗑️ Очистить план
          </Button>
        </ActionsCard>

        <ImportExportPanel
          currentPlan={getCurrentPlan()}
          onPlanImported={handlePlanImported}
        />
      </Sidebar>

      <StageSelectionModal
        stages={stages}
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onSelect={handleStageSelected}
      />

      {addExerciseToStageModalStageId && (
        <AddExerciseToStageModal
          stage={stages.find((s) => s.id === addExerciseToStageModalStageId)!}
          isOpen={isAddExerciseToStageModalOpen}
          onClose={() => {
            setIsAddExerciseToStageModalOpen(false);
            setAddExerciseToStageModalStageId(null);
          }}
          onSelect={handleAddExerciseToStageFromModal}
        />
      )}
    </BuilderContainer>
  );
};


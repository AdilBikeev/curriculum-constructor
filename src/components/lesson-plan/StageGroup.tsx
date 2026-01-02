import React from 'react';
import styled from 'styled-components';
import { LessonPlanItem } from '../../types';
import { LessonPlanItemComponent } from './LessonPlanItem';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface StageGroupProps {
  stageId: string;
  stageName: string;
  items: LessonPlanItem[];
  onRemoveItem: (id: string) => void;
  onMoveExerciseUp?: (id: string) => void;
  onMoveExerciseDown?: (id: string) => void;
  onMoveStageUp?: (stageId: string) => void;
  onMoveStageDown?: (stageId: string) => void;
  canMoveStageUp?: boolean;
  canMoveStageDown?: boolean;
}

const StageGroupCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} !important;
  border: 2px solid ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.lightGray};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md} !important;
  }
`;

const StageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const StageHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
`;

const StageIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const StageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const StageTitle = styled.div`
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.dark};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const StageCount = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.secondary};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`;

const StageHeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`;

const StageItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StageDuration = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  padding: 2px ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
  margin-left: auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

export const StageGroup: React.FC<StageGroupProps> = ({
  stageId,
  stageName,
  items,
  onRemoveItem,
  onMoveExerciseUp,
  onMoveExerciseDown,
  onMoveStageUp,
  onMoveStageDown,
  canMoveStageUp = false,
  canMoveStageDown = false,
}) => {
  const stageDuration = items.reduce((sum, item) => sum + item.duration, 0);
  // Используем элементы в исходном порядке (без сортировки)
  const sortedItems = [...items];

  const getExerciseCanMoveUp = (itemIndex: number): boolean => {
    return itemIndex > 0;
  };

  const getExerciseCanMoveDown = (itemIndex: number): boolean => {
    return itemIndex < sortedItems.length - 1;
  };

  return (
    <StageGroupCard>
      <StageHeader>
        <StageHeaderLeft>
          <StageIcon>📋</StageIcon>
          <StageInfo>
            <StageTitle>{stageName}</StageTitle>
            <StageCount>
              {items.length} {items.length === 1 ? 'упражнение' : items.length < 5 ? 'упражнения' : 'упражнений'}
              <StageDuration>⏱️ {stageDuration} мин</StageDuration>
            </StageCount>
          </StageInfo>
        </StageHeaderLeft>
        <StageHeaderActions>
          {onMoveStageUp && canMoveStageUp && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onMoveStageUp) {
                  onMoveStageUp(stageId);
                }
              }}
              title="Переместить стадию вверх"
              style={{ minWidth: '32px', padding: '4px 8px', zIndex: 10, position: 'relative' }}
            >
              ↑↑
            </Button>
          )}
          {onMoveStageDown && canMoveStageDown && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onMoveStageDown) {
                  onMoveStageDown(stageId);
                }
              }}
              title="Переместить стадию вниз"
              style={{ minWidth: '32px', padding: '4px 8px', zIndex: 10, position: 'relative' }}
            >
              ↓↓
            </Button>
          )}
        </StageHeaderActions>
      </StageHeader>
      <StageItemsList>
        {sortedItems.map((item, index) => (
          <LessonPlanItemComponent
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            onMoveUp={onMoveExerciseUp}
            onMoveDown={onMoveExerciseDown}
            canMoveUp={getExerciseCanMoveUp(index)}
            canMoveDown={getExerciseCanMoveDown(index)}
          />
        ))}
      </StageItemsList>
    </StageGroupCard>
  );
};


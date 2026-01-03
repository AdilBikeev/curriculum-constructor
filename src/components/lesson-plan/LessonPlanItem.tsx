import React from 'react';
import styled from 'styled-components';
import { LessonPlanItem as LessonPlanItemType } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface LessonPlanItemProps {
  item: LessonPlanItemType;
  startTime?: string;
  onRemove: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const ItemCard = styled(Card)`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.primaryLight};
  background-color: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.transitions.normal};
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
  }

  &:hover {
    border-left-color: ${({ theme }) => theme.colors.primaryDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
    background-color: ${({ theme }) => theme.colors.light};
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const OrderNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 0.8125rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 32px;
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.dark};
  word-wrap: break-word;
  line-height: 1.3;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.9375rem;
  }
`;

const ItemSubtitle = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  word-wrap: break-word;
  line-height: 1.3;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`;

const ItemDuration = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  padding: 2px ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemTime = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  padding: 2px ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.colors.gray};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`;

export const LessonPlanItemComponent: React.FC<LessonPlanItemProps> = ({
  item,
  startTime,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}) => {
  return (
    <ItemCard>
      <ItemContent>
        <OrderNumber>{item.order}</OrderNumber>
        <ItemInfo>
          <ItemTitle>{item.exerciseName}</ItemTitle>
          <ItemSubtitle>
            {item.stageName}
            {startTime && <ItemTime>🕐 {startTime}</ItemTime>}
            <ItemDuration>⏱️ {item.duration} мин</ItemDuration>
          </ItemSubtitle>
        </ItemInfo>
      </ItemContent>
      <ItemActions>
        {onMoveUp && canMoveUp && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onMoveUp) {
                onMoveUp(item.id);
              }
            }}
            title="Переместить вверх"
            style={{ minWidth: '32px', padding: '4px 8px', zIndex: 10, position: 'relative' }}
          >
            ↑
          </Button>
        )}
        {onMoveDown && canMoveDown && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onMoveDown) {
                onMoveDown(item.id);
              }
            }}
            title="Переместить вниз"
            style={{ minWidth: '32px', padding: '4px 8px', zIndex: 10, position: 'relative' }}
          >
            ↓
          </Button>
        )}
        <Button 
          variant="danger" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item.id);
          }}
          style={{ minWidth: '32px', padding: '4px 8px', zIndex: 10, position: 'relative' }}
        >
          ✕
        </Button>
      </ItemActions>
    </ItemCard>
  );
};


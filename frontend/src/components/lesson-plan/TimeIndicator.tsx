import React from 'react';
import styled from 'styled-components';
import { LESSON_DURATION } from '../../types';
import { formatDuration, secondsToMinutes } from '../../utils/timeFormat';

interface TimeIndicatorProps {
  usedTime: number;
  totalTime?: number;
}

const TimeIndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TimeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9375rem;
  font-weight: 600;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
  }
`;

const TimeLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`;

const TimeValue = styled.span<{ $isOver: boolean }>`
  color: ${({ theme, $isOver }) => ($isOver ? theme.colors.danger : theme.colors.primary)};
  font-size: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.inner};
  position: relative;
`;

const ProgressFill = styled.div<{ $percentage: number; $isOver: boolean }>`
  height: 100%;
  width: ${({ $percentage }) => Math.min($percentage, 100)}%;
  background: ${({ theme, $isOver }) =>
    $isOver
      ? `linear-gradient(90deg, ${theme.colors.danger} 0%, ${theme.colors.dangerLight} 100%)`
      : theme.colors.gradientSuccess};
  transition: width ${({ theme }) => theme.transitions.slow} ease, background 0.3s ease;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const TimeText = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  font-weight: 500;
`;

export const TimeIndicator: React.FC<TimeIndicatorProps> = ({
  usedTime,
  totalTime = LESSON_DURATION,
}) => {
  const percentage = (usedTime / totalTime) * 100;
  const remainingTime = totalTime - usedTime;
  const isOver = usedTime > totalTime;

  return (
    <TimeIndicatorWrapper>
      <TimeInfo>
        <TimeLabel>Использовано времени:</TimeLabel>
        <TimeValue $isOver={isOver}>
          {formatDuration(usedTime)} / {formatDuration(totalTime)}
        </TimeValue>
      </TimeInfo>
      <ProgressBar>
        <ProgressFill $percentage={percentage} $isOver={isOver} />
      </ProgressBar>
      <TimeText>
        {isOver ? (
          <span style={{ color: '#ef4444', fontWeight: 600 }}>
            ⚠️ Превышено на {formatDuration(Math.abs(remainingTime))}
          </span>
        ) : (
          <span>
            {remainingTime > 600 ? '✅' : '⏳'} Осталось: {formatDuration(remainingTime)}
          </span>
        )}
      </TimeText>
    </TimeIndicatorWrapper>
  );
};


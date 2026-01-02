import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LessonStage } from '../../types';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

interface AddExerciseToStageModalProps {
  stage: LessonStage;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(Card)`
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StageInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 500;
`;

const ExerciseInfoWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const ExerciseInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 500;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const AddExerciseToStageModal: React.FC<AddExerciseToStageModalProps> = ({
  stage,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedExercise = stage.exercises.find((e) => e.id === selectedExerciseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExerciseId) {
      onSelect(selectedExerciseId);
      setSelectedExerciseId('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedExerciseId('');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e?.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Добавить упражнение</ModalTitle>
          <CloseButton onClick={handleClose} type="button">
            ×
          </CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <StageInfo>
              Стадия: <strong>{stage.name}</strong>
            </StageInfo>
            <Select
              label="Упражнение"
              options={stage.exercises.map((exercise) => ({
                value: exercise.id,
                label: exercise.name,
              }))}
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              required
              autoFocus
            />
            {selectedExercise && (
              <ExerciseInfoWrapper>
                <ExerciseInfo>
                  ⏱️ Длительность: <span>{selectedExercise.duration} мин</span>
                </ExerciseInfo>
              </ExerciseInfoWrapper>
            )}
          </ModalBody>
          <ModalActions>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!selectedExerciseId}>
              Добавить
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};


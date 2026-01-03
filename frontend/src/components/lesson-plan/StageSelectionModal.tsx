import React, { useState } from 'react';
import styled from 'styled-components';
import { LessonStage } from '../../types';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

interface StageSelectionModalProps {
  stages: LessonStage[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stageId: string) => void;
  title?: string;
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

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const StageSelectionModal: React.FC<StageSelectionModalProps> = ({
  stages,
  isOpen,
  onClose,
  onSelect,
  title = 'Выберите стадию',
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStageId) {
      onSelect(selectedStageId);
      setSelectedStageId('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStageId('');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e?.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={handleClose} type="button">
            ×
          </CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Select
              label="Стадия занятия"
              options={stages.map((stage) => ({
                value: stage.id,
                label: stage.name,
              }))}
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
              required
              autoFocus
            />
          </ModalBody>
          <ModalActions>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!selectedStageId}>
              Добавить
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};


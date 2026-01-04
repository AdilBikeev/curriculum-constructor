import styled from 'styled-components';
import { Button } from '../common/Button';

const AddButtonWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  display: flex;
  justify-content: center;
  border-top: 1px dashed ${({ theme }) => theme.colors.gray};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.gray};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const CompactAddButton = styled.button<{ $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px dashed ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.75rem;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.normal};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 0.6)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  
  &:hover:not(:disabled) {
    opacity: 1;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(99, 102, 241, 0.05);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

interface AddStageButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddStageButton: React.FC<AddStageButtonProps> = ({ onClick, disabled }) => {
  return (
    <AddButtonWrapper>
      <CompactAddButton
        onClick={onClick}
        disabled={disabled}
        $disabled={disabled}
        title="Добавить стадию"
      >
        ➕
      </CompactAddButton>
    </AddButtonWrapper>
  );
};


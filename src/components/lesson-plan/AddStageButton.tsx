import styled from 'styled-components';
import { Button } from '../common/Button';

const AddButtonWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

interface AddStageButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddStageButton: React.FC<AddStageButtonProps> = ({ onClick, disabled }) => {
  return (
    <AddButtonWrapper>
      <Button
        variant="secondary"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        style={{ width: '100%', maxWidth: '300px' }}
      >
        ➕ Добавить стадию
      </Button>
    </AddButtonWrapper>
  );
};


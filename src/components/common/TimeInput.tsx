import React from 'react';
import styled from 'styled-components';

interface TimeInputProps {
  label?: string;
  value: string; // Format: "HH:MM"
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.gray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)')};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Принудительно скрываем AM/PM если браузер их показывает */
  &::-webkit-calendar-picker-indicator {
    filter: invert(0);
  }

  /* Для Firefox и других браузеров */
  &::-moz-calendar-picker-indicator {
    filter: invert(0);
  }
`;

const ErrorText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
`;

export const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        type="time"
        value={value || '14:00'}
        onChange={handleChange}
        $hasError={!!error}
        disabled={disabled}
        step="60"
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};


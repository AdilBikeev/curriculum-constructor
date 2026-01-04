import React from 'react';
import styled from 'styled-components';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

const StyledCard = styled.div<{ $clickable: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  transition: all ${({ theme }) => theme.transitions.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }

  ${({ $clickable, theme }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: ${theme.shadows.lg};
      border-color: ${theme.colors.primaryLight};
    }
  `}
`;

export const Card: React.FC<CardProps> = ({ children, className, onClick, style, ...props }) => {
  return (
    <StyledCard 
      className={className} 
      $clickable={!!onClick} 
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </StyledCard>
  );
};


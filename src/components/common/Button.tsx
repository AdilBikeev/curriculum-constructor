import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  padding: ${({ $size, theme }) => {
    const sizes = {
      sm: `${theme.spacing.sm} ${theme.spacing.md}`,
      md: `${theme.spacing.md} ${theme.spacing.lg}`,
      lg: `${theme.spacing.lg} ${theme.spacing.xl}`,
    };
    return sizes[$size as keyof typeof sizes];
  }};
  font-size: ${({ $size }) => {
    const sizes = { sm: '0.875rem', md: '1rem', lg: '1.125rem' };
    return sizes[$size as keyof typeof sizes];
  }};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ $variant, theme }) => {
    const variants = {
      primary: {
        background: theme.colors.gradientPrimary,
        color: theme.colors.white,
        '&:hover': { 
          background: theme.colors.primaryDark,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-2px)',
        },
      },
      secondary: {
        background: theme.colors.secondary,
        color: theme.colors.white,
        '&:hover': { 
          background: theme.colors.secondaryDark,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-2px)',
        },
      },
      danger: {
        background: theme.colors.danger,
        color: theme.colors.white,
        '&:hover': { 
          background: theme.colors.dangerLight,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-2px)',
        },
      },
      success: {
        background: theme.colors.success,
        color: theme.colors.white,
        '&:hover': { 
          background: theme.colors.successLight,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-2px)',
        },
      },
    };
    const style = variants[$variant as keyof typeof variants];
    const hoverStyles = style['&:hover'];
    return `
      background: ${style.background};
      color: ${style.color};
      &:hover {
        background: ${hoverStyles.background};
        box-shadow: ${hoverStyles.boxShadow};
        transform: ${hoverStyles.transform};
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: ${theme.shadows.sm} !important;
      }
    `;
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
};


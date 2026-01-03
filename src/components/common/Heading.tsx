import React from 'react';
import styled from 'styled-components';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

const StyledHeading = styled.h1<{ $level: number }>`
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
  letter-spacing: -0.02em;

  ${({ $level }) => {
    const sizes = {
      1: '2.5rem',
      2: '2rem',
      3: '1.75rem',
      4: '1.5rem',
      5: '1.25rem',
      6: '1rem',
    };
    return `font-size: ${sizes[$level as keyof typeof sizes]};`;
  }}
`;

export const Heading: React.FC<HeadingProps> = ({ level, children, className }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <StyledHeading as={Tag} $level={level} className={className}>
      {children}
    </StyledHeading>
  );
};



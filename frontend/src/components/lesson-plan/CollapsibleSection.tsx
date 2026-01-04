import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../common/Card';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const SectionCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md} !important;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md} !important;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SectionTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ToggleIcon = styled.span<{ $isExpanded: boolean }>`
  transition: transform ${({ theme }) => theme.transitions.normal};
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SectionContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => ($isExpanded ? '2000px' : '0')};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.normal};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
`;

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <SectionCard>
      <SectionHeader onClick={() => setIsExpanded(!isExpanded)}>
        <SectionTitle>
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </SectionTitle>
        <ToggleIcon $isExpanded={isExpanded}>▶</ToggleIcon>
      </SectionHeader>
      <SectionContent $isExpanded={isExpanded}>{children}</SectionContent>
    </SectionCard>
  );
};


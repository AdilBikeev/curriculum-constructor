import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/common/Container';
import { Heading } from '../components/common/Heading';
import { LessonPlanBuilder } from '../components/lesson-plan/LessonPlanBuilder';
import { useStages } from '../context/StagesContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - 80px);
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled(Heading)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.7;
  max-width: 800px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.125rem;
  }
`;

const LessonPlanPage: React.FC = () => {
  const { stages, refreshStages, refreshStageExercises } = useStages();
  
  // refreshStages и refreshStageExercises доступны только при useApi=true
  const handleRefreshStages = refreshStages || (async () => {});
  const handleRefreshStageExercises = refreshStageExercises || (async () => {});

  const handleSave = (items: any[]) => {
    // Здесь можно добавить логику сохранения
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <PageTitle level={1}>Конструктор плана урока</PageTitle>
          <PageDescription>
            Создайте план урока для занятия кавказскими танцами. Выбирайте упражнения из
            библиотеки и формируйте структурированный план с автоматическим контролем времени.
            Общее время занятия: <strong>90 минут (1.5 часа)</strong>.
          </PageDescription>
        </PageHeader>
        <LessonPlanBuilder 
          stages={stages} 
          onSave={handleSave} 
          onRefreshStages={handleRefreshStages}
          onRefreshStageExercises={handleRefreshStageExercises}
        />
      </Container>
    </PageContainer>
  );
};

export default LessonPlanPage;


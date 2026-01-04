import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/common/Container';
import { LessonPlanBuilder } from '../components/lesson-plan/LessonPlanBuilder';
import { useStages } from '../context/StagesContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - 80px);
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


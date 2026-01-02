import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../components/common/Container';
import { Heading } from '../components/common/Heading';
import { LessonPlanBuilder } from '../components/lesson-plan/LessonPlanBuilder';
import { Button } from '../components/common/Button';
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

const AdminLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const LessonPlanPage: React.FC = () => {
  const { stages } = useStages();

  const handleSave = (items: any[]) => {
    // Здесь можно добавить логику сохранения
    console.log('Сохранение плана урока:', items);
    alert(`✅ План урока сохранен! Всего упражнений: ${items.length}`);
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
          <AdminLink to="/admin">
            <Button variant="secondary">⚙️ Управление стадиями и упражнениями</Button>
          </AdminLink>
        </PageHeader>
        <LessonPlanBuilder stages={stages} onSave={handleSave} />
      </Container>
    </PageContainer>
  );
};

export default LessonPlanPage;


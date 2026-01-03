import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { Heading } from '../components/common/Heading';
import { StageManager } from '../components/admin/StageManager';
import { Button } from '../components/common/Button';
import { useStages } from '../context/StagesContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - 80px);
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 300px;
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

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.125rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: flex-end;
    width: auto;
  }

  button {
    width: 100%;

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      width: auto;
    }
  }
`;

const BackLink = styled(Link)`
  text-decoration: none;
`;

const AdminPage: React.FC = () => {
  const { stages, updateStages, resetToDefault } = useStages();

  const handleUpdateStages = (updatedStages: typeof stages) => {
    updateStages(updatedStages);
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <HeaderContent>
            <PageTitle level={1}>⚙️ Управление стадиями и упражнениями</PageTitle>
            <PageDescription>
              Здесь вы можете добавлять, редактировать и удалять стадии занятий и упражнения.
              Изменения сохраняются автоматически и будут доступны в конструкторе планов.
            </PageDescription>
          </HeaderContent>
          <HeaderActions>
            <BackLink to="/lesson-plan">
              <Button variant="secondary">← Вернуться к конструктору</Button>
            </BackLink>
            <Button variant="secondary" onClick={resetToDefault}>
              🔄 Сбросить к значениям по умолчанию
            </Button>
          </HeaderActions>
        </PageHeader>
        <StageManager stages={stages} onUpdate={handleUpdateStages} />
      </Container>
    </PageContainer>
  );
};

export default AdminPage;


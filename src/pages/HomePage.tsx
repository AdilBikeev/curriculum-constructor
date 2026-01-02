import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../components/common/Container';
import { Heading } from '../components/common/Heading';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

const HomePageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
`;

const WelcomeCard = styled(Card)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xxxl};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  line-height: 1.8;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.125rem;
  }
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  text-align: left;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FeatureDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const HomePage: React.FC = () => {
  return (
    <HomePageContainer>
      <Container>
        <WelcomeCard>
          <Icon>💃</Icon>
          <Heading level={1}>Конструктор планов уроков</Heading>
          <Description>
            Создавайте профессиональные планы занятий для школы кавказских танцев. Выбирайте
            упражнения из библиотеки и формируйте план урока с автоматическим контролем времени
            (90 минут).
          </Description>
          <FeaturesList>
            <Feature>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Быстро и удобно</FeatureTitle>
                <FeatureDescription>Создавайте планы за несколько минут</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>⏱️</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Контроль времени</FeatureTitle>
                <FeatureDescription>Автоматический подсчет времени занятия</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureText>
                <FeatureTitle>Библиотека упражнений</FeatureTitle>
                <FeatureDescription>Готовые упражнения и стадии занятий</FeatureDescription>
              </FeatureText>
            </Feature>
          </FeaturesList>
          <StyledLink to="/lesson-plan">
            <Button size="lg">Начать создание плана</Button>
          </StyledLink>
        </WelcomeCard>
      </Container>
    </HomePageContainer>
  );
};

export default HomePage;



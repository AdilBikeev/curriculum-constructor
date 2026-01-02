import React from 'react';
import styled from 'styled-components';
import { Container } from '../components/common/Container';
import { Heading } from '../components/common/Heading';

const HomePageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const HomePage: React.FC = () => {
  return (
    <HomePageContainer>
      <Container>
        <Heading level={1}>Конструктор учебных программ</Heading>
        <p>Добро пожаловать в конструктор учебных программ!</p>
      </Container>
    </HomePageContainer>
  );
};

export default HomePage;



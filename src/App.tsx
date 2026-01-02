import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { StagesProvider } from './context/StagesContext';
import { Header } from './components/common/Header';
import HomePage from './pages/HomePage';
import LessonPlanPage from './pages/LessonPlanPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <StagesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson-plan" element={<LessonPlanPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </StagesProvider>
    </ThemeProvider>
  );
};

export default App;



import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from './Container';

const HeaderWrapper = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-around;
    width: 100%;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.secondary)};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.light};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: ${theme.spacing.md};
      right: ${theme.spacing.md};
      height: 2px;
      background: ${theme.colors.gradientPrimary};
      border-radius: ${theme.borderRadius.full};
    }
  `}
`;

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo to="/">📚 План урока</Logo>
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            Главная
          </NavLink>
          <NavLink to="/lesson-plan" $active={location.pathname === '/lesson-plan'}>
            Конструктор
          </NavLink>
          <NavLink to="/admin" $active={location.pathname === '/admin'}>
            Управление
          </NavLink>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  );
};


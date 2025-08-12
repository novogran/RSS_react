import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';
import '@testing-library/jest-dom';

describe('Header', () => {
  const renderWithRouter = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<Header />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('отображает название приложения со ссылкой на главную страницу', () => {
    renderWithRouter();
    const titleLink = screen.getByRole('link', { name: /pokémon search/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('отображает навигационные ссылки', () => {
    renderWithRouter();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('правильно отмечает активную ссылку для домашней страницы', () => {
    renderWithRouter('/');
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });

    expect(homeLink).toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
  });

  it('правильно отмечает активную ссылку на страницу о нас', () => {
    renderWithRouter('/about');
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });

    expect(aboutLink).toHaveClass('active');
    expect(homeLink).not.toHaveClass('active');
  });

  it('имеет правильную структуру навигации', () => {
    renderWithRouter();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('nav-links');
  });
});

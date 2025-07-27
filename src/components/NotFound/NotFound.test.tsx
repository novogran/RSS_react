import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import '@testing-library/jest-dom';

describe('NotFound', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  it('отображает сообщение 404', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '404 - Page Not Found'
    );
  });

  it('отображает грустный смайлик', () => {
    expect(screen.getByText('😢')).toBeInTheDocument();
    expect(screen.getByText('😢')).toHaveClass('sad-pikachu');
  });

  it('показывает описательное сообщение', () => {
    expect(
      screen.getByText(/The Pokémon you are looking for has fled!/i)
    ).toBeInTheDocument();
  });

  it('содержит рабочую домашнюю ссылку', () => {
    const homeLink = screen.getByRole('link', {
      name: /Return to Pokémon Search/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass('home-link');
  });

  it('имеет правильные классы CSS', () => {
    expect(screen.getByTestId('not-found-container')).toHaveClass('not-found');
    expect(screen.getByTestId('not-found-content')).toHaveClass(
      'not-found-content'
    );
  });
});

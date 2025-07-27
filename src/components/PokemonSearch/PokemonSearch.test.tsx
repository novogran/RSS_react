import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  mockSuccessfulListFetch,
  mockSuccessfulSingleFetch,
  mockFailedFetch,
} from '../../test-utils/mocks/pokemonapi';
import PokemonSearch from './PokemonSearch';

describe('PokemonSearch', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    window.localStorage.clear();
  });

  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
  };

  it('Загружает сохраненный поисковый запрос из localStorage', async () => {
    window.localStorage.setItem('pokemonSearchTerm', 'pikachu');
    mockSuccessfulSingleFetch();

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('Загружает список покемонов при пустом поисковом запросе', async () => {
    mockSuccessfulListFetch();

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });
  });

  it('Ищет конкретного покемона', async () => {
    mockSuccessfulListFetch();
    mockSuccessfulSingleFetch();

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'pikachu');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Charizard')).not.toBeInTheDocument();
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(window.localStorage.getItem('pokemonSearchTerm')).toBe('pikachu');
    });
  });

  it('Тримит пробелы при поиске', async () => {
    mockSuccessfulListFetch();
    mockSuccessfulSingleFetch();

    renderWithRouter(<PokemonSearch />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, '  pikachu  ');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(window.localStorage.getItem('pokemonSearchTerm')).toBe('pikachu');
    });
  });

  it('Обрабатывает ошибки API', async () => {
    mockFailedFetch(404);

    renderWithRouter(<PokemonSearch />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'unknown');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('Отображает состояние загрузки', async () => {
    mockSuccessfulListFetch();

    renderWithRouter(<PokemonSearch />);

    expect(screen.getByText('Searching for Pokémon...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Searching for Pokémon...')
      ).not.toBeInTheDocument();
    });
  });
});

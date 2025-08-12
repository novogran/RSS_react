import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
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

  it('Загружает сохраненный поисковый запрос из localStorage', async () => {
    window.localStorage.setItem('pokemonSearchTerm', 'pikachu');
    mockSuccessfulSingleFetch();

    render(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('Загружает список покемонов при пустом поисковом запросе', async () => {
    mockSuccessfulListFetch();

    render(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });
  });

  it('Ищет конкретного покемона', async () => {
    mockSuccessfulListFetch();
    mockSuccessfulSingleFetch();

    render(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.queryByText('Charizard')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(window.localStorage.getItem('pokemonSearchTerm')).toBe('pikachu');
    });
  });

  it('Тримит пробелы при поиске', async () => {
    mockSuccessfulListFetch();
    mockSuccessfulSingleFetch();

    render(<PokemonSearch />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    const button = screen.getByRole('button', { name: 'Search' });

    await act(async () => {
      await user.type(input, '  pikachu  ');
      await user.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(window.localStorage.getItem('pokemonSearchTerm')).toBe('pikachu');
    });
  });

  it('Обрабатывает ошибки API', async () => {
    mockFailedFetch(404);

    render(<PokemonSearch />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(input, { target: { value: 'unknown' } });
    userEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Pokémon not found')).toBeInTheDocument();
    });
  });

  it('Отображает состояние загрузки', async () => {
    mockSuccessfulListFetch();

    render(<PokemonSearch />);

    expect(screen.getByText('Searching for Pokémon...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Searching for Pokémon...')
      ).not.toBeInTheDocument();
    });
  });
});

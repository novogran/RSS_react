import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  mockSuccessfulApiListFetch,
  mockSuccessfulApiSingleFetch,
  mockFailedFetch,
  mockFetch,
  mockPokemonListApi,
} from '../../test-utils/mocks/pokemonapi';
import PokemonSearch from './PokemonSearch';
import { vi } from 'vitest';
import { useLocalStorage } from '../../hooks/useLocalStorage';

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));

describe('PokemonSearch', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
  };

  it('Загружает сохраненный поисковый запрос из localStorage', async () => {
    vi.mocked(useLocalStorage).mockImplementation(() => ['pikachu', vi.fn()]);
    mockSuccessfulApiSingleFetch();

    renderWithRouter(<PokemonSearch />);

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('Загружает список покемонов при пустом поисковом запросе', async () => {
    mockSuccessfulApiListFetch();

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
    });
  });

  it('Ищет конкретного покемона', async () => {
    mockSuccessfulApiListFetch();
    mockSuccessfulApiSingleFetch();

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
    mockFetch.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            status: 200,
            json: async () => mockPokemonListApi,
          });
        }, 100);
      });
    });

    await act(async () => {
      renderWithRouter(<PokemonSearch />);
    });

    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText('Loading Pokémon...')
        ).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it('Показывает сообщение при пустом списке результатов', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        count: 0,
        results: [],
        next: null,
        previous: null,
      }),
    });

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    });
  });

  it('Показывает индикатор загрузки при медленном соединении', async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockPokemonListApi,
              }),
            1000
          )
        )
    );

    renderWithRouter(<PokemonSearch />);

    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText('Loading Pokémon...')
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
});

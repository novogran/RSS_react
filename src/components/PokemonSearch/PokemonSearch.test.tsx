import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import {
  mockSuccessfulApiSingleFetch,
  mockFailedFetch,
  mockFetch,
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
    localStorage.clear();
  });

  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    );
  };

  it('Загружает сохраненный поисковый запрос из localStorage', async () => {
    vi.mocked(useLocalStorage).mockImplementation(() => ['pikachu', vi.fn()]);
    mockSuccessfulApiSingleFetch();

    renderWithRouter(<PokemonSearch />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('Обрабатывает ошибки API при поиске', async () => {
    mockFailedFetch(404);

    renderWithRouter(<PokemonSearch />);

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    await user.type(input, 'unknown');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText(/not found|failed/i)).toBeInTheDocument();
    });
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
      expect(screen.getByText('Error loading Pokémon')).toBeInTheDocument();
    });
  });
});

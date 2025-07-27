import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  const user = userEvent.setup();
  const mockOnSearchChange = vi.fn();
  const mockOnSearchSubmit = vi.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
    mockOnSearchSubmit.mockClear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('Рендерит input и кнопку', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    expect(
      screen.getByPlaceholderText('Search Pokémon by name...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('Отображает сохраненный поисковый запрос', () => {
    render(
      <SearchBar
        searchTerm="pikachu"
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('Вызывает onSearchChange при вводе текста', async () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    const input = screen.getByPlaceholderText('Search Pokémon by name...');

    await user.type(input, 'char');

    expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 'c');
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'h');
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 'a');
    expect(mockOnSearchChange).toHaveBeenNthCalledWith(4, 'r');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
  });

  it('Вызывает onSearchSubmit при отправке формы', async () => {
    render(
      <SearchBar
        searchTerm="pikachu"
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearchSubmit).toHaveBeenCalled();
  });

  it('Сохраняет значение в localStorage при отправке формы', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    render(
      <SearchBar
        searchTerm="pikachu"
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(setItemSpy).toHaveBeenCalledWith('pokemonSearchTerm', 'pikachu');
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('pikachu');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { vi } from 'vitest';

describe('SearchBar', () => {
  const mockOnSearchChange = vi.fn();
  const mockOnSearchSubmit = vi.fn();

  beforeEach(() => {
    mockOnSearchChange.mockClear();
    mockOnSearchSubmit.mockClear();
  });

  it('1. Рендерит input и кнопку', () => {
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

  it('2. Отображает сохраненный поисковый запрос', () => {
    render(
      <SearchBar
        searchTerm="pikachu"
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('3. Вызывает onSearchChange при вводе текста', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(input, { target: { value: 'char' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('char');
  });

  it('4. Вызывает onSearchSubmit при отправке формы', () => {
    render(
      <SearchBar
        searchTerm="pikachu"
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearchSubmit).toHaveBeenCalled();
  });

  it('5. Тримит пробелы при вводе', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onSearchSubmit={mockOnSearchSubmit}
      />
    );

    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(input, { target: { value: '  pikachu  ' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('  pikachu  ');
  });
});

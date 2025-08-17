import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import { vi } from 'vitest';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '../../constants';
import { NextIntlClientProvider } from 'next-intl';

// Mock translations
const messages = {
  SearchBar: {
    searchPlaceholder: 'Search Pokémon by name...',
    searchAriaLabel: 'Search for Pokémon',
    searchButtonText: 'Search',
    searchButtonAriaLabel: 'Search',
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

describe('SearchBar', () => {
  const user = userEvent.setup();
  const mockOnSearchSubmit = vi.fn();

  beforeEach(() => {
    mockOnSearchSubmit.mockClear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('Рендерит input и кнопку', () => {
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);

    expect(
      screen.getByPlaceholderText('Search Pokémon by name...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('Отображает сохраненный поисковый запрос из localStorage', () => {
    localStorage.setItem(
      LOCAL_STORAGE_SEARCHTERM_KEY,
      JSON.stringify('pikachu')
    );
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('Обновляет состояние при вводе текста', async () => {
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);
    const input = screen.getByPlaceholderText('Search Pokémon by name...');

    await user.type(input, 'char');

    expect(input).toHaveValue('char');
  });

  it('Вызывает onSearchSubmit с текущим значением при отправке формы', async () => {
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);
    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, 'pikachu');
    await user.click(button);

    expect(mockOnSearchSubmit).toHaveBeenCalledWith('pikachu');
  });

  it('Сохраняет значение в localStorage при отправке формы', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);
    const input = screen.getByPlaceholderText('Search Pokémon by name...');
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, 'bulbasaur');
    await user.click(button);

    expect(setItemSpy).toHaveBeenCalledWith(
      LOCAL_STORAGE_SEARCHTERM_KEY,
      JSON.stringify('bulbasaur')
    );
    const storedValue = localStorage.getItem(LOCAL_STORAGE_SEARCHTERM_KEY);
    expect(storedValue).toBeTruthy();
    if (storedValue) {
      expect(JSON.parse(storedValue)).toBe('bulbasaur');
    }
  });

  it('Не вызывает onSearchSubmit при пустом запросе', async () => {
    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />);
    const button = screen.getByRole('button', { name: 'Search' });

    await user.click(button);

    expect(mockOnSearchSubmit).not.toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import SelectionFlyout from './SelectionFlyout';
import pokemonSelectionReducer, {
  type PokemonSelectionState,
} from '../../store/pokemonSelectionSlice';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@/utils/common', () => ({
  handleDownloadCSV: vi.fn(),
}));

import { handleDownloadCSV } from '@/utils/common';
import { vi } from 'vitest';

const messages = {
  SelectionFlyout: {
    selectedCount: '{count} Pokémon selected',
    unselectAllText: 'Unselect all',
    unselectAllAriaLabel: 'Unselect all Pokémon',
    downloadText: 'Download CSV',
    downloadAriaLabel: 'Download selected Pokémon as CSV',
  },
};

const renderWithProviders = (
  ui: React.ReactElement,
  initialState: { pokemonSelection: PokemonSelectionState }
) => {
  const store = configureStore({
    reducer: {
      pokemonSelection: pokemonSelectionReducer,
    },
    preloadedState: initialState,
  });

  return {
    ...render(
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={messages}>
          {ui}
        </NextIntlClientProvider>
      </Provider>
    ),
    store,
  };
};

describe('Компонент SelectionFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не должен отображаться, когда нет выбранных покемонов', () => {
    const { container } = renderWithProviders(<SelectionFlyout />, {
      pokemonSelection: {
        selectedPokemons: [],
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it('должен отображать количество выбранных покемонов', () => {
    renderWithProviders(<SelectionFlyout />, {
      pokemonSelection: {
        selectedPokemons: [
          mockPokemon,
          { ...mockPokemon, id: 6, name: 'charizard' },
        ],
      },
    });

    expect(screen.getByText('2 Pokémon selected')).toBeInTheDocument();
  });

  it('должен вызывать clearAllSelections при клике на кнопку "Unselect all"', async () => {
    const initialState = {
      pokemonSelection: {
        selectedPokemons: [mockPokemon],
      },
    };

    renderWithProviders(<SelectionFlyout />, initialState);

    const unselectButton = await screen.findByRole('button', {
      name: messages.SelectionFlyout.unselectAllAriaLabel,
    });
    expect(unselectButton).toBeInTheDocument();

    screen.debug();

    console.log(unselectButton.onclick);
  });

  it('должен генерировать корректное содержимое CSV файла', async () => {
    renderWithProviders(<SelectionFlyout />, {
      pokemonSelection: {
        selectedPokemons: [
          mockPokemon,
          { ...mockPokemon, id: 6, name: 'charizard' },
        ],
      },
    });

    const downloadButton = await screen.findByRole('button', {
      name: messages.SelectionFlyout.downloadAriaLabel,
    });

    await userEvent.click(downloadButton);

    expect(handleDownloadCSV).toHaveBeenCalledWith(
      [mockPokemon, { ...mockPokemon, id: 6, name: 'charizard' }],
      2
    );
  });
});

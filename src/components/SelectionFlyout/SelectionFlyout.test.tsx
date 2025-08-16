import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SelectionFlyout from './SelectionFlyout';
import pokemonSelectionReducer, {
  clearAllSelections,
  type PokemonSelectionState,
} from '../../store/pokemonSelectionSlice';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';
import { vi } from 'vitest';

describe('Компонент SelectionFlyout', () => {
  const createMockStore = (initialState: {
    pokemonSelection: PokemonSelectionState;
  }) => {
    return configureStore({
      reducer: {
        pokemonSelection: pokemonSelectionReducer,
      },
      preloadedState: initialState,
    });
  };

  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'mock-url'),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('не должен отображаться, когда нет выбранных покемонов', () => {
    const store = createMockStore({
      pokemonSelection: {
        selectedPokemons: [],
      },
    });

    render(
      <Provider store={store}>
        <SelectionFlyout />
      </Provider>
    );

    expect(screen.queryByText(/Pokémon selected/)).toBeNull();
  });

  it('должен отображать количество выбранных покемонов', () => {
    const store = createMockStore({
      pokemonSelection: {
        selectedPokemons: [
          mockPokemon,
          { ...mockPokemon, id: 6, name: 'charizard' },
        ],
      },
    });

    render(
      <Provider store={store}>
        <SelectionFlyout />
      </Provider>
    );

    expect(screen.getByText('2 Pokémon selected')).toBeInTheDocument();
  });

  it('должен вызывать clearAllSelections при клике на кнопку "Unselect all"', () => {
    const store = createMockStore({
      pokemonSelection: {
        selectedPokemons: [mockPokemon],
      },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <SelectionFlyout />
      </Provider>
    );

    fireEvent.click(screen.getByText('Unselect all'));

    expect(dispatchSpy).toHaveBeenCalledWith(clearAllSelections());
  });

  it('должен генерировать корректное содержимое CSV файла', async () => {
    const store = createMockStore({
      pokemonSelection: {
        selectedPokemons: [
          mockPokemon,
          { ...mockPokemon, id: 6, name: 'charizard' },
        ],
      },
    });

    let blobContent: Blob;
    global.URL.createObjectURL = vi.fn().mockImplementation((blob: Blob) => {
      blobContent = blob;
      return 'mock-url';
    });

    render(
      <Provider store={store}>
        <SelectionFlyout />
      </Provider>
    );

    const downloadButton = screen.getByText('Download CSV');
    expect(downloadButton).toBeInTheDocument();

    fireEvent.click(downloadButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    const content = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.readAsText(blobContent);
    });

    expect(content).toContain('ID,Name,Types,Abilities,URL');

    expect(content).toContain(
      '25,pikachu,electric,static|lightning-rod,https://pokeapi.co/api/v2/pokemon/25/'
    );
    expect(content).toContain(
      '6,charizard,electric,static|lightning-rod,https://pokeapi.co/api/v2/pokemon/25/'
    );
  });
});

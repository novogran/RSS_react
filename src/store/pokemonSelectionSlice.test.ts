import { describe, it, expect } from 'vitest';
import pokemonSelectionReducer, {
  togglePokemonSelection,
  clearAllSelections,
  type PokemonSelectionState,
} from './pokemonSelectionSlice';
import { mockPokemon } from '../test-utils/mocks/pokemonapi';

describe('pokemonSelectionSlice', () => {
  it('должен возвращать начальное состояние', () => {
    const initialState: PokemonSelectionState = {
      selectedPokemons: [],
    };

    expect(pokemonSelectionReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('должен добавлять покемона при первом вызове togglePokemonSelection', () => {
    const initialState: PokemonSelectionState = {
      selectedPokemons: [],
    };

    const state = pokemonSelectionReducer(
      initialState,
      togglePokemonSelection(mockPokemon)
    );

    expect(state.selectedPokemons).toEqual([mockPokemon]);
  });

  it('должен удалять покемона при повторном вызове togglePokemonSelection', () => {
    const initialState: PokemonSelectionState = {
      selectedPokemons: [mockPokemon],
    };

    const state = pokemonSelectionReducer(
      initialState,
      togglePokemonSelection(mockPokemon)
    );

    expect(state.selectedPokemons).toEqual([]);
  });

  it('должен добавлять нескольких покемонов', () => {
    const charizard = {
      ...mockPokemon,
      id: 6,
      name: 'charizard',
    };

    let state = pokemonSelectionReducer(
      undefined,
      togglePokemonSelection(mockPokemon)
    );

    state = pokemonSelectionReducer(state, togglePokemonSelection(charizard));

    expect(state.selectedPokemons).toEqual([mockPokemon, charizard]);
  });

  it('должен очищать все выбранные покемоны при clearAllSelections', () => {
    const initialState: PokemonSelectionState = {
      selectedPokemons: [
        mockPokemon,
        { ...mockPokemon, id: 6, name: 'charizard' },
      ],
    };

    const state = pokemonSelectionReducer(initialState, clearAllSelections());

    expect(state.selectedPokemons).toEqual([]);
  });

  it('должен корректно обрабатывать переключение разных покемонов', () => {
    const charizard = {
      ...mockPokemon,
      id: 6,
      name: 'charizard',
    };

    let state = pokemonSelectionReducer(
      undefined,
      togglePokemonSelection(mockPokemon)
    );

    state = pokemonSelectionReducer(state, togglePokemonSelection(charizard));

    state = pokemonSelectionReducer(state, togglePokemonSelection(mockPokemon));

    expect(state.selectedPokemons).toEqual([charizard]);
  });
});

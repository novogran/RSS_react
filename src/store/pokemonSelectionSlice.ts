import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon } from '@/types/pokemonSearch.types';

export interface PokemonSelectionState {
  selectedPokemons: Pokemon[];
}

const initialState: PokemonSelectionState = {
  selectedPokemons: [],
};

export const pokemonSelectionSlice = createSlice({
  name: 'pokemonSelection',
  initialState,
  reducers: {
    togglePokemonSelection: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      const existingIndex = state.selectedPokemons.findIndex(
        (item) => item.id === pokemon.id
      );

      if (existingIndex >= 0) {
        state.selectedPokemons.splice(existingIndex, 1);
      } else {
        state.selectedPokemons.push(pokemon);
      }
    },
    clearAllSelections: (state) => {
      state.selectedPokemons = [];
    },
  },
  selectors: {
    selectedPokemonSelector: (state) => state.selectedPokemons,
    isPokemonSelected: (state, pokemonId: number) =>
      state.selectedPokemons.some((pokemon) => pokemon.id === pokemonId),
  },
});

export const { selectedPokemonSelector, isPokemonSelected } =
  pokemonSelectionSlice.selectors;
export const { togglePokemonSelection, clearAllSelections } =
  pokemonSelectionSlice.actions;
export default pokemonSelectionSlice.reducer;

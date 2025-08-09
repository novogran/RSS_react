import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon } from '../PokemonSearch/types/pokemonSearch.types';

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

      if (state.selectedPokemons.find((item) => item.id === pokemon.id)) {
        state.selectedPokemons = state.selectedPokemons.filter(
          (item) => item.id !== pokemon.id
        );
      } else {
        state.selectedPokemons = [...state.selectedPokemons, pokemon];
      }
    },
    clearAllSelections: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { togglePokemonSelection, clearAllSelections } =
  pokemonSelectionSlice.actions;
export default pokemonSelectionSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon } from '../components/PokemonSearch/types/pokemonSearch.types';

export interface PokemonSelectionState {
  selectedPokemons: Record<number, Pokemon>;
}

const initialState: PokemonSelectionState = {
  selectedPokemons: {},
};

export const pokemonSelectionSlice = createSlice({
  name: 'pokemonSelection',
  initialState,
  reducers: {
    togglePokemonSelection: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;

      if (state.selectedPokemons[pokemon.id]) {
        state.selectedPokemons = Object.fromEntries(
          Object.entries(state.selectedPokemons).filter(
            ([id]) => id !== pokemon.id.toString()
          )
        );
      } else {
        state.selectedPokemons = {
          ...state.selectedPokemons,
          [pokemon.id]: pokemon,
        };
      }
    },
    clearAllSelections: (state) => {
      state.selectedPokemons = {};
    },
  },
});

export const { togglePokemonSelection, clearAllSelections } =
  pokemonSelectionSlice.actions;
export default pokemonSelectionSlice.reducer;
